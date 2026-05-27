import prisma from "@servexa-warranty-ai/db";
import {
  Prisma,
  ReasoningTraceStatus,
  ReasoningTraceStepType,
} from "@servexa-warranty-ai/db/prisma/client";

import type {
  CreateReasoningTraceInput,
  IReasoningTraceRepository,
  UpsertReasoningTraceEventInput,
} from "../interfaces/reasoning-trace-repository.interface";
import type { ReasoningTrace, ReasoningTraceEvent } from "@servexa-warranty-ai/ai-contracts";
import { jsonToSafeDetails } from "@/utils/json-to-safe-details";
import { toInputJsonValue } from "../hitl/prisma-json";

function toReasoningTrace(row: {
  traceId: string;
  runId: string | null;
  threadId: string | null;
  status: string;
  startedAt: Date;
  endedAt: Date | null;
  createdByUserId: string;
  events: Array<{
    stepId: string;
    parentStepId: string | null;
    type: string;
    status: string;
    title: string;
    summary: string;
    errorMessage: string | null;
    startedAt: Date | null;
    endedAt: Date | null;
    durationMs: number | null;
    agentName: string | null;
    toolName: string | null;
    workflowKind: string | null;
    hitlRequestId: string | null;
    safeDetails: Prisma.JsonValue | null;
    evidenceSourceIds: string[];
    relatedEntityIds: string[];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    traceId: string;
  }>;
}): ReasoningTrace {
  return {
    traceId: row.traceId,
    runId: row.runId ?? undefined,
    threadId: row.threadId ?? undefined,
    status: row.status as ReasoningTrace["status"],
    startedAt: row.startedAt.toISOString(),
    endedAt: row.endedAt?.toISOString(),
    events: row.events.map((e) => ({
      id: e.stepId,
      traceId: row.traceId,
      runId: row.runId ?? undefined,
      threadId: row.threadId ?? undefined,
      parentStepId: e.parentStepId ?? undefined,
      type: e.type as ReasoningTraceEvent["type"],
      status: e.status as ReasoningTraceEvent["status"],
      title: e.title,
      summary: e.summary,
      errorMessage: e.errorMessage ?? undefined,
      startedAt: e.startedAt?.toISOString(),
      endedAt: e.endedAt?.toISOString(),
      durationMs: e.durationMs ?? undefined,
      agentName: e.agentName ?? undefined,
      toolName: e.toolName ?? undefined,
      workflowKind: e.workflowKind ?? undefined,
      hitlRequestId: e.hitlRequestId ?? undefined,
      safeDetails: jsonToSafeDetails(e.safeDetails),
      evidenceSourceIds: e.evidenceSourceIds.length ? e.evidenceSourceIds : undefined,
      relatedEntityIds: e.relatedEntityIds.length ? e.relatedEntityIds : undefined,
    })),
  };
}

function toReasoningTraceEvent(row: {
  stepId: string;
  parentStepId: string | null;
  type: string;
  status: string;
  title: string;
  summary: string;
  errorMessage: string | null;
  startedAt: Date | null;
  endedAt: Date | null;
  durationMs: number | null;
  agentName: string | null;
  toolName: string | null;
  workflowKind: string | null;
  hitlRequestId: string | null;
  safeDetails: Prisma.JsonValue | null;
  evidenceSourceIds: string[];
  relatedEntityIds: string[];
  traceId: string;
  runId: string | null;
  threadId: string | null;
}): ReasoningTraceEvent {
  return {
    id: row.stepId,
    traceId: row.traceId,
    runId: row.runId ?? undefined,
    threadId: row.threadId ?? undefined,
    parentStepId: row.parentStepId ?? undefined,
    type: row.type as ReasoningTraceEvent["type"],
    status: row.status as ReasoningTraceEvent["status"],
    title: row.title,
    summary: row.summary,
    errorMessage: row.errorMessage ?? undefined,
    startedAt: row.startedAt?.toISOString(),
    endedAt: row.endedAt?.toISOString(),
    durationMs: row.durationMs ?? undefined,
    agentName: row.agentName ?? undefined,
    toolName: row.toolName ?? undefined,
    workflowKind: row.workflowKind ?? undefined,
    hitlRequestId: row.hitlRequestId ?? undefined,
    safeDetails: jsonToSafeDetails(row.safeDetails),
    evidenceSourceIds: row.evidenceSourceIds.length ? row.evidenceSourceIds : undefined,
    relatedEntityIds: row.relatedEntityIds.length ? row.relatedEntityIds : undefined,
  };
}

export class ReasoningTraceRepository implements IReasoningTraceRepository {
  async upsertTrace(input: CreateReasoningTraceInput): Promise<void> {
    await prisma.aiReasoningTrace.upsert({
      where: { traceId: input.traceId },
      update: {
        runId: input.runId ?? null,
        threadId: input.threadId ?? null,
        repairCaseId: input.repairCaseId ?? null,
        createdByUserId: input.userId,
        status: input.status ?? "running",
        startedAt: input.startedAt ?? undefined,
      },
      create: {
        traceId: input.traceId,
        runId: input.runId ?? null,
        threadId: input.threadId ?? null,
        repairCaseId: input.repairCaseId ?? null,
        createdByUserId: input.userId,
        status: input.status ?? "running",
        startedAt: input.startedAt ?? new Date(),
      },
    });
  }

  async upsertEvent(input: UpsertReasoningTraceEventInput): Promise<void> {
    const e = input.event;
    await prisma.aiReasoningTraceEvent.upsert({
      where: {
        traceId_stepId: {
          traceId: input.traceId,
          stepId: e.id,
        },
      },
      update: {
        parentStepId: e.parentStepId ?? null,
        type: e.type as ReasoningTraceStepType,
        status: e.status as ReasoningTraceStatus,
        title: e.title,
        summary: e.summary,
        errorMessage: e.errorMessage ?? null,
        startedAt: e.startedAt ? new Date(e.startedAt) : null,
        endedAt: e.endedAt ? new Date(e.endedAt) : null,
        durationMs: e.durationMs ?? null,
        agentName: e.agentName ?? null,
        toolName: e.toolName ?? null,
        workflowKind: e.workflowKind ?? null,
        hitlRequestId: e.hitlRequestId ?? null,
        safeDetails: e.safeDetails ? toInputJsonValue(e.safeDetails) : Prisma.JsonNull,
        evidenceSourceIds: e.evidenceSourceIds ?? [],
        relatedEntityIds: e.relatedEntityIds ?? [],
      },
      create: {
        traceId: input.traceId,
        stepId: e.id,
        parentStepId: e.parentStepId ?? null,
        type: e.type as ReasoningTraceStepType,
        status: e.status as ReasoningTraceStatus,
        title: e.title,
        summary: e.summary,
        errorMessage: e.errorMessage ?? null,
        startedAt: e.startedAt ? new Date(e.startedAt) : null,
        endedAt: e.endedAt ? new Date(e.endedAt) : null,
        durationMs: e.durationMs ?? null,
        agentName: e.agentName ?? null,
        toolName: e.toolName ?? null,
        workflowKind: e.workflowKind ?? null,
        hitlRequestId: e.hitlRequestId ?? null,
        safeDetails: e.safeDetails ? toInputJsonValue(e.safeDetails) : Prisma.JsonNull,
        evidenceSourceIds: e.evidenceSourceIds ?? [],
        relatedEntityIds: e.relatedEntityIds ?? [],
      },
    });
  }

  async markTraceCompleted(input: { traceId: string; endedAt?: Date }): Promise<void> {
    await prisma.aiReasoningTrace.update({
      where: { traceId: input.traceId },
      data: {
        status: "completed",
        endedAt: input.endedAt ?? new Date(),
      },
    });
  }

  async markTraceFailed(input: { traceId: string; endedAt?: Date }): Promise<void> {
    await prisma.aiReasoningTrace.update({
      where: { traceId: input.traceId },
      data: {
        status: "failed",
        endedAt: input.endedAt ?? new Date(),
      },
    });
  }

  async findByTraceIdForUser(input: {
    userId: string;
    traceId: string;
  }): Promise<ReasoningTrace | null> {
    const row = await prisma.aiReasoningTrace.findUnique({
      where: { traceId: input.traceId },
      include: {
        events: {
          orderBy: { startedAt: "asc" },
          select: {
            stepId: true,
            traceId: true,
            parentStepId: true,
            type: true,
            status: true,
            title: true,
            summary: true,
            errorMessage: true,
            startedAt: true,
            endedAt: true,
            durationMs: true,
            agentName: true,
            toolName: true,
            workflowKind: true,
            hitlRequestId: true,
            safeDetails: true,
            evidenceSourceIds: true,
            relatedEntityIds: true,
          },
        },
      },
    });

    if (!row || row.createdByUserId !== input.userId) return null;

    return toReasoningTrace({
      traceId: row.traceId,
      runId: row.runId,
      threadId: row.threadId,
      status: row.status,
      startedAt: row.startedAt,
      endedAt: row.endedAt,
      createdByUserId: row.createdByUserId,
      events: row.events,
    });
  }

  async listByRepairCaseIdForUser(input: {
    userId: string;
    repairCaseId: string;
  }): Promise<ReasoningTrace[]> {
    const traces = await prisma.aiReasoningTrace.findMany({
      where: {
        createdByUserId: input.userId,
        repairCaseId: input.repairCaseId,
      },
      orderBy: { startedAt: "desc" },
      select: {
        traceId: true,
        runId: true,
        threadId: true,
        status: true,
        startedAt: true,
        endedAt: true,
      },
    });

    return traces.map((t) => ({
      traceId: t.traceId,
      runId: t.runId ?? undefined,
      threadId: t.threadId ?? undefined,
      status: t.status as ReasoningTrace["status"],
      startedAt: t.startedAt.toISOString(),
      endedAt: t.endedAt?.toISOString(),
      events: [],
    }));
  }

  async listEventsByTraceIdForUser(input: {
    userId: string;
    traceId: string;
  }): Promise<ReasoningTraceEvent[]> {
    const trace = await prisma.aiReasoningTrace.findUnique({
      where: { traceId: input.traceId },
      select: {
        traceId: true,
        runId: true,
        threadId: true,
        createdByUserId: true,
      },
    });

    if (!trace || trace.createdByUserId !== input.userId) return [];

    const events = await prisma.aiReasoningTraceEvent.findMany({
      where: { traceId: input.traceId },
      orderBy: { startedAt: "asc" },
      select: {
        stepId: true,
        parentStepId: true,
        type: true,
        status: true,
        title: true,
        summary: true,
        errorMessage: true,
        startedAt: true,
        endedAt: true,
        durationMs: true,
        agentName: true,
        toolName: true,
        workflowKind: true,
        hitlRequestId: true,
        safeDetails: true,
        evidenceSourceIds: true,
        relatedEntityIds: true,
        traceId: true,
      },
    });

    return events.map((e) =>
      toReasoningTraceEvent({
        ...e,
        runId: trace.runId,
        threadId: trace.threadId,
      }),
    );
  }
}

