import { randomUUID } from "node:crypto";

import { IoredisService } from "@servexa-warranty-ai/db";
import { env } from "@servexa-warranty-ai/env/server";

import type { AiJobEnqueueBody, AiJobType } from "@/modules/v1/ai/schemas/ai-request.schema";
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
    const envelope = {
      jobId,
      tenantId: payload.tenantId ?? "",
      userId: payload.userId ?? "",
      type: payload.type,
      query: payload.query,
      context: payload.context ?? {},
      createdAt: new Date().toISOString(),
    };

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

    await this.redis.xaddStream(
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
      JSON.stringify({ ...envelope, status: "queued" }),
      86_400,
    );

    return { jobId, stream };
  }

  async getJobMeta(jobId: string): Promise<Record<string, unknown> | null> {
    await this.connect();
    const raw = await this.redis.get(`${JOB_META_PREFIX}${jobId}`);
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
  }
}
