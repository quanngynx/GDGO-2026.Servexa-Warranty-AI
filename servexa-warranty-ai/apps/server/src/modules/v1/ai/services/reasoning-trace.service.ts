import type { AccessTokenPayload } from "@/types/jwt";

import { createOperationalError } from "@/middlewares/error-middleware";
import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";

import {
  applyTraceStreamEvent,
  type ReasoningTrace,
  type ReasoningTraceEvent,
  type ReasoningTraceStreamEvent,
  sanitizeReasoningEventForUi,
} from "@servexa-warranty-ai/ai-contracts";
import { reasoningTraceStreamEventSchema } from "@servexa-warranty-ai/event-contracts";

import type { IReasoningTraceRepository } from "../interfaces/reasoning-trace-repository.interface";
import { ReasoningTraceRepository } from "../repositories/reasoning-trace.repository";

export class ReasoningTraceService {
  constructor(
    private readonly repo: IReasoningTraceRepository = new ReasoningTraceRepository(),
  ) {}

  async createTrace(input: {
    user: AccessTokenPayload;
    traceId: string;
    runId?: string;
    threadId?: string;
    repairCaseId?: string;
    startedAt?: Date;
    status?: ReasoningTrace["status"];
  }): Promise<void> {
    await this.repo.upsertTrace({
      traceId: input.traceId,
      runId: input.runId,
      threadId: input.threadId,
      repairCaseId: input.repairCaseId,
      userId: input.user.id,
      startedAt: input.startedAt,
      status: input.status,
    });
  }

  async appendEvent(input: {
    user: AccessTokenPayload;
    traceId: string;
    event: ReasoningTraceEvent;
  }): Promise<void> {
    // We don't require the DB trace row exists here; normalizer can create it earlier.
    await this.repo.upsertEvent({ traceId: input.traceId, event: input.event });
  }

  async updateEvent(input: {
    user: AccessTokenPayload;
    traceId: string;
    event: ReasoningTraceEvent;
  }): Promise<void> {
    await this.repo.upsertEvent({ traceId: input.traceId, event: input.event });
  }

  async markTraceCompleted(input: { traceId: string; endedAt?: Date }): Promise<void> {
    await this.repo.markTraceCompleted({ traceId: input.traceId, endedAt: input.endedAt });
  }

  async markTraceFailed(input: { traceId: string; endedAt?: Date }): Promise<void> {
    await this.repo.markTraceFailed({ traceId: input.traceId, endedAt: input.endedAt });
  }

  async findByTraceId(user: AccessTokenPayload, traceId: string): Promise<ReasoningTrace> {
    const trace = await this.repo.findByTraceIdForUser({ userId: user.id, traceId });
    if (!trace) {
      throw createOperationalError("Reasoning trace not found", HTTP_RESPONSE_CODE.NOT_FOUND);
    }
    return trace;
  }

  async listByRepairCaseId(user: AccessTokenPayload, repairCaseId: string): Promise<ReasoningTrace[]> {
    return this.repo.listByRepairCaseIdForUser({ userId: user.id, repairCaseId });
  }

  async listEventsByTraceId(
    user: AccessTokenPayload,
    traceId: string,
  ): Promise<ReasoningTraceEvent[]> {
    return this.repo.listEventsByTraceIdForUser({ userId: user.id, traceId });
  }

  /** Copilot gateway / Redis bridge — persist without full JWT shape. */
  async applyStreamEventForUserId(input: {
    userId: string;
    traceId: string;
    streamEvent: ReasoningTraceStreamEvent;
    repairCaseId?: string;
    current?: ReasoningTrace;
  }): Promise<{
    reasoningTrace: ReasoningTrace;
    latestReasoningEvent?: ReasoningTraceEvent;
  }> {
    const parsed = reasoningTraceStreamEventSchema.parse(input.streamEvent);
    const { reasoningTrace, latestReasoningEvent } = applyTraceStreamEvent(
      input.current,
      parsed,
    );

    if (parsed.event === "reasoning.trace.started") {
      await this.repo.upsertTrace({
        traceId: input.traceId,
        userId: input.userId,
        runId: parsed.runId,
        threadId: parsed.threadId,
        repairCaseId: input.repairCaseId,
        status: "running",
      });
    }

    if (parsed.step) {
      const step = sanitizeReasoningEventForUi(parsed.step);
      await this.repo.upsertEvent({ traceId: input.traceId, event: step });
    }

    if (parsed.event === "reasoning.trace.completed") {
      await this.repo.markTraceCompleted({ traceId: input.traceId });
    }

    if (parsed.event === "reasoning.trace.failed") {
      await this.repo.markTraceFailed({ traceId: input.traceId });
    }

    return {
      reasoningTrace,
      latestReasoningEvent: latestReasoningEvent
        ? sanitizeReasoningEventForUi(latestReasoningEvent)
        : undefined,
    };
  }

  async persistSnapshotForUserId(input: {
    userId: string;
    trace: ReasoningTrace;
    repairCaseId?: string;
  }): Promise<void> {
    await this.repo.upsertTrace({
      traceId: input.trace.traceId,
      userId: input.userId,
      runId: input.trace.runId,
      threadId: input.trace.threadId,
      repairCaseId: input.repairCaseId,
      status: input.trace.status,
      startedAt: input.trace.startedAt ? new Date(input.trace.startedAt) : undefined,
    });

    for (const event of input.trace.events) {
      await this.repo.upsertEvent({
        traceId: input.trace.traceId,
        event: sanitizeReasoningEventForUi(event),
      });
    }

    if (input.trace.status === "completed") {
      await this.repo.markTraceCompleted({
        traceId: input.trace.traceId,
        endedAt: input.trace.endedAt ? new Date(input.trace.endedAt) : undefined,
      });
    } else if (input.trace.status === "failed") {
      await this.repo.markTraceFailed({
        traceId: input.trace.traceId,
        endedAt: input.trace.endedAt ? new Date(input.trace.endedAt) : undefined,
      });
    }
  }
}

