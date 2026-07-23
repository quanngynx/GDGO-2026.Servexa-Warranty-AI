import { logger } from "@/core/logging";
import prisma from "@/core/infra/prisma";
import { getBootstrapRedis } from "@/core/infra/ioredis/redis-bootstrap";
import { getStorageProvider } from "@/core/file-storage/storage.factory";
import ExcelJS from "exceljs";
import cron from "node-cron";

const STREAM_KEY = "product:export:jobs";
const CONSUMER_GROUP = "export-workers";
const CONSUMER_NAME = `worker-${process.pid}`;
const BATCH_SIZE = 1000;
/** How long to sleep between polls when there are no messages (ms) */
const POLL_INTERVAL_MS = 2000;

export async function startProductExportWorker() {
  const redis = getBootstrapRedis();
  if (!redis) {
    logger.error("Redis not initialized in export worker");
    return;
  }

  // All commands (including XREADGROUP) use the shared client with a NON-BLOCKING call.
  // Non-blocking XREADGROUP returns immediately (<1ms) — never hits commandTimeout.
  // We sleep POLL_INTERVAL_MS between empty polls instead of using BLOCK.
  const client = redis.getClient();

  try {
    await client.xgroup("CREATE", STREAM_KEY, CONSUMER_GROUP, "0", "MKSTREAM");
    logger.info(
      `Consumer group ${CONSUMER_GROUP} created for stream ${STREAM_KEY}`,
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (!msg.includes("BUSYGROUP")) {
      logger.error("Error creating consumer group", { error: msg });
      throw error;
    }
  }

  // Start periodic cleanup/reconciliation job
  cron.schedule("*/10 * * * *", async () => {
    logger.info("Running Export Job cleanup & reconciliation...");
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    try {
      // 1. Fail stalled jobs (processing > 1 hour)
      await prisma.productExportJob.updateMany({
        where: {
          status: "processing",
          updatedAt: { lt: oneHourAgo },
        },
        data: {
          status: "failed",
          errorMessage: "Job stalled and was timed out by worker",
        },
      });

      // 2. Cleanup expired jobs (older than retention, e.g. 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const expiredJobs = await prisma.productExportJob.findMany({
        where: { createdAt: { lt: sevenDaysAgo } },
        select: { id: true, storageKey: true },
      });

      if (expiredJobs.length > 0) {
        const storage = getStorageProvider();
        for (const job of expiredJobs) {
          if (job.storageKey) {
            try {
              await storage.deleteFile(job.storageKey);
            } catch (err) {
              logger.error("Failed to delete expired file", {
                id: job.id,
                err,
              });
            }
          }
        }
        await prisma.productExportJob.deleteMany({
          where: { id: { in: expiredJobs.map((j) => j.id) } },
        });
      }
    } catch (err) {
      logger.error("Reconciliation task error", { err });
    }
  });

  logger.info(
    `Worker ${CONSUMER_NAME} started consuming (non-blocking poll, interval=${POLL_INTERVAL_MS}ms)...`,
  );

  // Continuous poll loop — NON-BLOCKING XREADGROUP.
  //
  // Why non-blocking instead of BLOCK?
  // The shared ioredis client has commandTimeout: 1000ms. A blocking XREADGROUP BLOCK 5000
  // would time out at 1s, causing ioredis to reconnect the socket and potentially reject
  // concurrently queued commands (e.g. xadd in the controller). Non-blocking XREADGROUP
  // returns immediately (<1ms) — always within commandTimeout. We sleep POLL_INTERVAL_MS
  // when there are no messages, giving acceptable latency (≤2s to pick up a new job).
  while (true) {
    try {
      // Non-blocking: no BLOCK parameter — returns null or messages immediately.
      // ioredis returns: [[streamName, [[msgId, [field, val, ...]], ...]], ...] | null
      const stream = (await client.xreadgroup(
        "GROUP",
        CONSUMER_GROUP,
        CONSUMER_NAME,
        "COUNT",
        1,
        "STREAMS",
        STREAM_KEY,
        ">",
      )) as [string, [string, string[]][]][] | null;

      if (stream && stream.length > 0) {
        const messages = stream[0]?.[1];
        if (!messages) continue;
        for (const message of messages) {
          const [messageId, fields] = message;
          // fields is flat [key, value, ...] e.g. ['jobId', '<uuid>']
          const jobIdIndex = fields.indexOf("jobId");
          const jobId = jobIdIndex !== -1 ? fields[jobIdIndex + 1] : fields[1];
          if (!jobId) {
            logger.error(`Stream message ${messageId} has no jobId, skipping`);
            await client.xack(STREAM_KEY, CONSUMER_GROUP, messageId);
            continue;
          }
          try {
            await processJob(jobId);
          } catch (jobErr: unknown) {
            logger.error(`Unhandled error in processJob ${jobId}`, {
              error: jobErr instanceof Error ? jobErr.message : String(jobErr),
              stack: jobErr instanceof Error ? jobErr.stack : undefined,
            });
          } finally {
            // Always ACK so the message doesn't remain pending and block the group
            await client.xack(STREAM_KEY, CONSUMER_GROUP, messageId);
          }
        }
      } else {
        // No messages yet — pause before next poll to avoid spinning the event loop
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      logger.error("Error consuming stream", { error: msg, stack });

      // If the consumer group was deleted (e.g. Redis restart), recreate it
      if (msg.includes("NOGROUP")) {
        try {
          await client.xgroup(
            "CREATE",
            STREAM_KEY,
            CONSUMER_GROUP,
            "$",
            "MKSTREAM",
          );
          logger.info("Recreated consumer group after NOGROUP error");
        } catch {
          // Ignore BUSYGROUP or other errors — will retry on next iteration
        }
      }

      // Wait before retrying to prevent hot loop on error
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

async function processJob(jobId: string) {
  logger.info(`Processing export job ${jobId}`);

  const job = await prisma.productExportJob.findUnique({
    where: { id: jobId },
  });

  if (!job || job.status === "cancelled" || job.status === "completed") {
    logger.info(`Job ${jobId} ignored (status: ${job?.status})`);
    return;
  }

  try {
    await prisma.productExportJob.update({
      where: { id: jobId },
      data: { status: "processing", startedAt: new Date() },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Models");

    sheet.columns = [
      { header: "modelCode", key: "modelCode", width: 18 },
      { header: "name", key: "name", width: 28 },
      { header: "categoryId", key: "categoryId", width: 38 },
      { header: "status", key: "status", width: 12 },
      { header: "laborCost", key: "laborCost", width: 12 },
      { header: "inspectionCost", key: "inspectionCost", width: 14 },
      { header: "stockNumber", key: "stockNumber", width: 12 },
      { header: "image", key: "image", width: 36 },
      { header: "createdAt", key: "createdAt", width: 24 },
      { header: "updatedAt", key: "updatedAt", width: 24 },
    ];

    let lastId = job.lastCursorId || "";
    let processedRows = job.processedRows || 0;
    const snapshotAt = job.snapshotAt;

    while (true) {
      // Re-fetch job to check for cancellation
      const currentJobState = await prisma.productExportJob.findUnique({
        where: { id: jobId },
        select: { status: true },
      });
      if (currentJobState?.status === "cancelled") {
        logger.info(`Job ${jobId} was cancelled during processing`);
        return;
      }

      const rows = await prisma.model.findMany({
        take: BATCH_SIZE,
        skip: lastId ? 1 : 0,
        cursor: lastId ? { id: lastId } : undefined,
        where: {
          deletedAt: null,
          createdAt: { lte: snapshotAt },
        },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: {
          id: true,
          modelCode: true,
          name: true,
          categoryId: true,
          status: true,
          laborCost: true,
          inspectionCost: true,
          stockNumber: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (rows.length === 0) {
        break;
      }

      for (const row of rows) {
        sheet.addRow({
          modelCode: row.modelCode,
          name: row.name,
          categoryId: row.categoryId,
          status: row.status,
          laborCost: row.laborCost !== null ? Number(row.laborCost) : "",
          inspectionCost:
            row.inspectionCost !== null ? Number(row.inspectionCost) : "",
          stockNumber: row.stockNumber,
          image: row.image ?? "",
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        });
      }

      processedRows += rows.length;
      lastId = rows[rows.length - 1]?.id || "";

      // Update progress — use lastCursorId (not idempotencyKey) for cursor tracking
      await prisma.productExportJob.update({
        where: { id: jobId },
        data: { lastCursorId: lastId, processedRows },
      });
    }

    // Write to buffer and upload
    logger.info(`Job ${jobId} finished reading DB, uploading to storage...`);
    const buffer = await workbook.xlsx.writeBuffer();
    const storage = getStorageProvider();

    // Convert ArrayBuffer to node Buffer
    const nodeBuffer = Buffer.from(buffer);

    const uploadResult = await storage.uploadFile(
      nodeBuffer,
      `models-export-${jobId}.xlsx`,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "exports",
    );

    await prisma.productExportJob.update({
      where: { id: jobId },
      data: {
        status: "completed",
        completedAt: new Date(),
        fileName: uploadResult.url,
        storageKey: uploadResult.key,
      },
    });

    logger.info(`Export job ${jobId} completed successfully`);
  } catch (error: any) {
    logger.error(`Error processing job ${jobId}`, { error });
    await prisma.productExportJob.update({
      where: { id: jobId },
      data: {
        status: "failed",
        errorMessage: String(error.message || error),
      },
    });
  }
}
