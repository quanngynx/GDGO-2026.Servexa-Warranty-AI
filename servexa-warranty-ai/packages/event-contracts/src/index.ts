import { z } from "zod";

export const aiJobTypeSchema = z.enum([
  "anomaly_detection",
  "report_generation",
  "summarization",
  "chat_followup",
  "analysis",
  /** Async corpus ingestion (Redis → worker → server internal ingest). */
  "knowledge_ingest",
]);

export const aiJobEnvelopeSchema = z.object({
  version: z.literal("1.0"),
  jobId: z.string().min(1),
  tenantId: z.string(),
  userId: z.string(),
  type: aiJobTypeSchema,
  query: z.string().min(1),
  context: z.record(z.string(), z.unknown()).default({}),
  idempotencyKey: z.string().optional(),
  /** Optional trace id propagated to Python coordinator / tools */
  traceId: z.string().optional(),
  createdAt: z.string().min(1),
  retryCount: z.number().int().nonnegative().default(0),
});

export type AiJobEnvelope = z.infer<typeof aiJobEnvelopeSchema>;

export const aiJobDlqEnvelopeSchema = z.object({
  version: z.literal("1.0"),
  stream: z.string().min(1),
  messageId: z.string().min(1),
  reason: z.enum([
    "invalid_json",
    "invalid_payload",
    "processing_error",
    "poison_message",
  ]),
  error: z.string().optional(),
  payload: z.string().optional(),
  jobId: z.string().optional(),
  retryCount: z.coerce.number().int().nonnegative().default(0),
  createdAt: z.string().min(1),
});

export type AiJobDlqEnvelope = z.infer<typeof aiJobDlqEnvelopeSchema>;

export {
  hitlEventActionKindSchema,
  hitlEventEnvelopeSchema,
  hitlEventTypeSchema,
  type HitlEventEnvelope,
  type HitlEventType,
} from "./hitl-events";

