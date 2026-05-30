import type { ReasoningTrace, ReasoningTraceEvent } from "@servexa-warranty-ai/ai-contracts";

export type CreateReasoningTraceInput = {
  traceId: string;
  runId?: string;
  threadId?: string;
  repairCaseId?: string;
  userId: string;
  startedAt?: Date;
  status?: ReasoningTrace["status"];
};

export type UpsertReasoningTraceEventInput = {
  traceId: string;
  event: ReasoningTraceEvent;
};

export interface IReasoningTraceRepository {
  upsertTrace(input: CreateReasoningTraceInput): Promise<void>;
  upsertEvent(input: UpsertReasoningTraceEventInput): Promise<void>;

  markTraceCompleted(input: {
    traceId: string;
    endedAt?: Date;
  }): Promise<void>;
  markTraceFailed(input: {
    traceId: string;
    endedAt?: Date;
  }): Promise<void>;

  findByTraceIdForUser(input: {
    userId: string;
    traceId: string;
  }): Promise<ReasoningTrace | null>;

  listByRepairCaseIdForUser(input: {
    userId: string;
    repairCaseId: string;
  }): Promise<ReasoningTrace[]>;

  listEventsByTraceIdForUser(input: {
    userId: string;
    traceId: string;
  }): Promise<ReasoningTraceEvent[]>;
}

