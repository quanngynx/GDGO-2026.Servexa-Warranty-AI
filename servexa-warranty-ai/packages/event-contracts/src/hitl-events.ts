import { z } from "zod";

/** Mirrors `hitlActionKindSchema` in @servexa-warranty-ai/ai-contracts */
export const hitlEventActionKindSchema = z.enum([
  "repair_escalation",
  "technician_assignment",
  "customer_response_draft",
  "part_order_request",
  "warranty_exception",
]);

export const hitlEventTypeSchema = z.enum([
  "hitl.request.created",
  "hitl.request.decided",
  "hitl.action.executed",
  "hitl.action.failed",
  "hitl.graph.resumed",
]);

export const hitlEventEnvelopeSchema = z.object({
  version: z.literal("1.0"),
  event: hitlEventTypeSchema,
  requestId: z.string(),
  tenantId: z.string().default(""),
  userId: z.string(),
  kind: hitlEventActionKindSchema,
  payload: z.record(z.string(), z.unknown()).default({}),
  traceId: z.string().optional(),
  createdAt: z.string(),
});

export type HitlEventType = z.infer<typeof hitlEventTypeSchema>;
export type HitlEventEnvelope = z.infer<typeof hitlEventEnvelopeSchema>;
