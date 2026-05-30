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

export const reasoningTraceStreamEventTypeSchema = z.enum([
  "reasoning.trace.started",
  "reasoning.step.started",
  "reasoning.step.delta",
  "reasoning.step.completed",
  "reasoning.step.failed",
  "reasoning.trace.completed",
  "reasoning.trace.failed",
]);

export const reasoningTraceStreamEventSchema = z.object({
  event: reasoningTraceStreamEventTypeSchema,
  traceId: z.string(),
  runId: z.string().optional(),
  threadId: z.string().optional(),
  step: reasoningTraceEventSchema.optional(),
  trace: reasoningTraceSchema.optional(),
});

export type ReasoningTraceStreamEvent = z.infer<typeof reasoningTraceStreamEventSchema>;

