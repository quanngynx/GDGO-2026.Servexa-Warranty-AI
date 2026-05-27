import { z } from "zod";

export const reasoningTraceStepTypeSchema = z.enum([
  "run",
  "routing",
  "retrieval",
  "rerank",
  "tool",
  "hitl",
  "workflow",
  "generation",
  "finalization",
  "error",
]);

export const reasoningTraceStatusSchema = z.enum([
  "pending",
  "running",
  "completed",
  "failed",
  "skipped",
  "waiting_for_human",
]);

/**
 * Operational, auditable reasoning summary.
 * IMPORTANT: this schema is for safe summaries (no raw chain-of-thought).
 */
export const reasoningTraceEventSchema = z.object({
  id: z.string(),
  traceId: z.string(),
  runId: z.string().optional(),
  threadId: z.string().optional(),
  parentStepId: z.string().optional(),

  type: reasoningTraceStepTypeSchema,
  status: reasoningTraceStatusSchema,

  title: z.string(),
  summary: z.string(),

  startedAt: z.string().optional(),
  endedAt: z.string().optional(),
  durationMs: z.number().optional(),

  agentName: z.string().optional(),
  toolName: z.string().optional(),
  workflowKind: z.string().optional(),
  hitlRequestId: z.string().optional(),

  evidenceSourceIds: z.array(z.string()).optional(),
  relatedEntityIds: z.array(z.string()).optional(),

  /**
   * Key/value details that are safe to expose.
   * Sanitization (allowlist) is implemented in helper functions.
   */
  safeDetails: z.record(z.string(), z.unknown()).optional(),

  errorMessage: z.string().optional(),
});

export type ReasoningTraceEvent = z.infer<typeof reasoningTraceEventSchema>;

export const reasoningTraceSchema = z.object({
  traceId: z.string(),
  runId: z.string().optional(),
  threadId: z.string().optional(),
  status: reasoningTraceStatusSchema,
  events: z.array(reasoningTraceEventSchema),
  startedAt: z.string(),
  endedAt: z.string().optional(),
});

export type ReasoningTrace = z.infer<typeof reasoningTraceSchema>;

export type ReasoningTraceStreamEvent = {
  event: string;
  traceId: string;
  runId?: string;
  threadId?: string;
  step?: ReasoningTraceEvent;
  trace?: ReasoningTrace;
};

export function upsertTraceStep(
  events: ReasoningTraceEvent[],
  step: ReasoningTraceEvent,
): ReasoningTraceEvent[] {
  const idx = events.findIndex((e) => e.id === step.id);
  if (idx === -1) return [...events, step];

  const prev = events[idx];
  if (!prev) {
    // TypeScript: defensive guard for out-of-bounds / undefined.
    return [...events, step];
  }
  const merged: ReasoningTraceEvent = {
    ...prev,
    ...step,
    // If delta updates are partial, ensure we keep the parent relationship.
    parentStepId: step.parentStepId ?? prev.parentStepId,
  };

  const next = [...events];
  next[idx] = merged;
  return next;
}

export function applyTraceStreamEvent(
  current: ReasoningTrace | undefined,
  streamEvent: ReasoningTraceStreamEvent,
): {
  reasoningTrace: ReasoningTrace;
  latestReasoningEvent?: ReasoningTraceEvent;
} {
  const traceId = streamEvent.traceId;

  if (streamEvent.event === "reasoning.trace.started") {
    if (streamEvent.trace) {
      return { reasoningTrace: streamEvent.trace };
    }
    const reasoningTrace: ReasoningTrace = {
      traceId,
      runId: streamEvent.runId,
      threadId: streamEvent.threadId,
      status: "running",
      startedAt: new Date().toISOString(),
      events: [],
    };
    return { reasoningTrace };
  }

  if (
    streamEvent.event === "reasoning.step.started" ||
    streamEvent.event === "reasoning.step.delta" ||
    streamEvent.event === "reasoning.step.completed" ||
    streamEvent.event === "reasoning.step.failed"
  ) {
    if (!streamEvent.step) {
      // Nothing to merge without a step payload.
      return { reasoningTrace: current ?? {
        traceId,
        runId: streamEvent.runId,
        threadId: streamEvent.threadId,
        status: "running",
        startedAt: new Date().toISOString(),
        events: [],
      }};
    }

    const prev = current ?? {
      traceId,
      runId: streamEvent.step.runId ?? streamEvent.runId,
      threadId: streamEvent.step.threadId ?? streamEvent.threadId,
      status: "running" as const,
      startedAt: streamEvent.step.startedAt ?? new Date().toISOString(),
      events: [],
    };

    const nextEvents = upsertTraceStep(prev.events, streamEvent.step);
    const nextTrace: ReasoningTrace = {
      ...prev,
      runId: streamEvent.step.runId ?? prev.runId,
      threadId: streamEvent.step.threadId ?? prev.threadId,
      status: streamEvent.step.status,
      // If we just received the first step, propagate startedAt.
      startedAt: prev.startedAt || streamEvent.step.startedAt || new Date().toISOString(),
      events: nextEvents,
      endedAt: streamEvent.step.endedAt ?? prev.endedAt,
    };

    return { reasoningTrace: nextTrace, latestReasoningEvent: streamEvent.step };
  }

  if (streamEvent.event === "reasoning.trace.completed") {
    if (streamEvent.trace) {
      return { reasoningTrace: streamEvent.trace };
    }
    if (!current) {
      return {
        reasoningTrace: {
          traceId,
          runId: streamEvent.runId,
          threadId: streamEvent.threadId,
          status: "completed",
          startedAt: new Date().toISOString(),
          events: [],
          endedAt: new Date().toISOString(),
        },
      };
    }

    return {
      reasoningTrace: {
        ...current,
        status: "completed",
        endedAt: current.endedAt ?? new Date().toISOString(),
      },
      latestReasoningEvent: current.events.length
        ? current.events[current.events.length - 1]
        : undefined,
    };
  }

  if (streamEvent.event === "reasoning.trace.failed") {
    if (streamEvent.trace) {
      return { reasoningTrace: streamEvent.trace };
    }
    if (!current) {
      return {
        reasoningTrace: {
          traceId,
          runId: streamEvent.runId,
          threadId: streamEvent.threadId,
          status: "failed",
          startedAt: new Date().toISOString(),
          events: [],
          endedAt: new Date().toISOString(),
        },
      };
    }

    return {
      reasoningTrace: {
        ...current,
        status: "failed",
        endedAt: current.endedAt ?? new Date().toISOString(),
      },
      latestReasoningEvent: current.events.length
        ? current.events[current.events.length - 1]
        : undefined,
    };
  }

  // Unknown event: return current unchanged.
  if (current) return { reasoningTrace: current };
  return {
    reasoningTrace: {
      traceId,
      runId: streamEvent.runId,
      threadId: streamEvent.threadId,
      status: "pending",
      startedAt: new Date().toISOString(),
      events: [],
    },
  };
}

const REASONING_TEXT_MAX_CHARS = 500;
const REASONING_TITLE_MAX_CHARS = 120;

const ALLOWED_SAFE_DETAILS_KEYS = new Set<string>([
  // Retrieval
  "queryType",
  "topK",
  "sourceTypes",
  // Tool calls
  "result",
  "candidateCount",
]);

function normalizeSingleLineText(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const v = raw.trim().replace(/\s+/g, " ");
  if (!v) return undefined;
  return v.length > REASONING_TEXT_MAX_CHARS
    ? v.slice(0, REASONING_TEXT_MAX_CHARS - 3) + "..."
    : v;
}

export function sanitizeReasoningSummary(raw: unknown): string | undefined {
  return normalizeSingleLineText(raw);
}

function sanitizeTitle(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const v = raw.trim().replace(/\s+/g, " ");
  if (!v) return undefined;
  return v.length > REASONING_TITLE_MAX_CHARS
    ? v.slice(0, REASONING_TITLE_MAX_CHARS - 3) + "..."
    : v;
}

function sanitizeSafeDetails(raw: unknown): Record<string, unknown> | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;

  const src = raw as Record<string, unknown>;
  const out: Record<string, unknown> = {};

  for (const [k, v] of Object.entries(src)) {
    if (!ALLOWED_SAFE_DETAILS_KEYS.has(k)) continue;

    if (typeof v === "string") {
      const s = v.length > 200 ? v.slice(0, 197) + "..." : v;
      if (s.trim()) out[k] = s;
      continue;
    }

    if (typeof v === "number" || typeof v === "boolean" || v === null) {
      out[k] = v;
      continue;
    }

    if (Array.isArray(v)) {
      // Only allow shallow arrays of primitives for UI safety.
      if (v.length > 20) continue;
      if (v.every((x) => typeof x === "string" && x.trim())) {
        out[k] = v.map((x) => (x.length > 120 ? x.slice(0, 117) + "..." : x));
        continue;
      }
      if (v.every((x) => typeof x === "number")) {
        out[k] = v;
      }
    }
  }

  return Object.keys(out).length ? out : undefined;
}

export function sanitizeReasoningEventForUi(
  event: ReasoningTraceEvent,
): ReasoningTraceEvent {
  return {
    ...event,
    title: sanitizeTitle(event.title) ?? event.title,
    summary: sanitizeReasoningSummary(event.summary) ?? event.summary,
    safeDetails: event.safeDetails ? sanitizeSafeDetails(event.safeDetails) : undefined,
    errorMessage: event.errorMessage ? normalizeSingleLineText(event.errorMessage) : undefined,
  };
}

