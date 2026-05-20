import { randomUUID } from "node:crypto";

import { aiJobEnvelopeSchema } from "@servexa-warranty-ai/event-contracts";
import { IoredisService } from "@servexa-warranty-ai/db";
import { env } from "@servexa-warranty-ai/env/server";

import type {
  AiJobEnqueueBody,
  AiJobType,
} from "@/modules/v1/ai/schemas/ai-request.schema";
import { logger } from "@/core/logging";
import { AiJobDuplicateError } from "@/core/helpers/exception.helper";

const JOB_META_PREFIX = "ai:job:meta:";
const JOB_DEDupe_PREFIX = "ai:job:dedupe:";

function streamForType(type: AiJobType): string {
  switch (type) {
    case "summarization":
    case "chat_followup":
      return env.AI_STREAM_CHAT;
    case "report_generation":
      return env.AI_STREAM_REPORT;
    case "anomaly_detection":
      return env.AI_STREAM_ANOMALY;
    case "knowledge_ingest":
      return env.AI_STREAM_INGEST;
    default:
      return env.AI_STREAM_ANALYSIS;
  }
}

export class AiJobStreamService {
  constructor(private redis = new IoredisService()) {}

  async connect(): Promise<void> {
    await this.redis.connect();
  }

  /**
   * Publishes a job envelope to Redis Streams (XADD … MAXLEN ~).
   * Optionally idempotent via `Idempotency-Key` HTTP header carried as idempotencyKey.
   */
  async enqueue(payload: AiJobEnqueueBody & { idempotencyKey?: string }) {
    await this.connect();

    const jobId = randomUUID();
    const envelope = aiJobEnvelopeSchema.parse({
      version: "1.0",
      jobId,
      tenantId: payload.tenantId ?? "",
      userId: payload.userId ?? "",
      type: payload.type,
      query: payload.query,
      context: payload.context ?? {},
      idempotencyKey: payload.idempotencyKey,
      traceId: payload.traceId,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    });

    const stream = streamForType(payload.type);

    if (payload.idempotencyKey) {
      const dedupeKey = `${JOB_DEDupe_PREFIX}${payload.idempotencyKey}`;
      const ok = await this.redis.setIfNotExists(dedupeKey, jobId, 86_400);
      if (!ok) {
        logger.warn("[ai-jobs] duplicate idempotency key", {
          stream,
          idempotencyKey: payload.idempotencyKey,
        });
        throw new AiJobDuplicateError();
      }
    }

    const messageId = await this.redis.xaddStream(
      stream,
      { payload: JSON.stringify(envelope) },
      env.AI_STREAM_MAXLEN_APPROX,
    );

    logger.info("[ai-jobs] published to stream", {
      stream,
      jobId,
      type: payload.type,
    });

    await this.redis.set(
      `${JOB_META_PREFIX}${jobId}`,
      JSON.stringify({
        ...envelope,
        status: "queued",
        stream,
        messageId,
        lastHeartbeatAt: new Date().toISOString(),
      }),
      86_400,
    );

    return { jobId, stream, messageId };
  }

  async getJobMeta(jobId: string): Promise<Record<string, unknown> | null> {
    await this.connect();
    const raw = await this.redis.get(`${JOB_META_PREFIX}${jobId}`);
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
  }

  async replayJob(
    jobId: string,
  ): Promise<{
    jobId: string;
    replayedTo: string;
    replayMessageId: string;
  } | null> {
    await this.connect();
    const meta = await this.getJobMeta(jobId);
    if (!meta) {
      return null;
    }

    const type = String(meta.type ?? "analysis") as AiJobType;
    const replayEnvelope = aiJobEnvelopeSchema.parse({
      version: "1.0",
      jobId,
      tenantId: String(meta.tenantId ?? ""),
      userId: String(meta.userId ?? ""),
      type,
      query: String(meta.query ?? ""),
      context: (meta.context ?? {}) as Record<string, unknown>,
      idempotencyKey: undefined,
      traceId: typeof meta.traceId === "string" ? meta.traceId : undefined,
      createdAt: new Date().toISOString(),
      retryCount: Number(meta.retryCount ?? 0),
    });

    const replayedTo = streamForType(type);
    const replayMessageId = await this.redis.xaddStream(
      replayedTo,
      { payload: JSON.stringify(replayEnvelope), replayOfJobId: jobId },
      env.AI_STREAM_MAXLEN_APPROX,
    );

    await this.redis.set(
      `${JOB_META_PREFIX}${jobId}`,
      JSON.stringify({
        ...meta,
        status: "replayed",
        replayedTo,
        replayMessageId,
      }),
      86_400,
    );

    return { jobId, replayedTo, replayMessageId };
  }
}
