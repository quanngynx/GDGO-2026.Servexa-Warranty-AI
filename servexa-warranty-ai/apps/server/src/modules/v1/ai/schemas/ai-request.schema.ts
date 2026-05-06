import z from "zod";

/** Job types aligned with redis_grpc_nodejs_erp_api_proposal.md §17 */
export const aiJobTypeSchema = z.enum([
  "anomaly_detection",
  "report_generation",
  "summarization",
  "chat_followup",
  "analysis",
]);

export const aiQueryBodySchema = z.object({
  query: z.string().trim().min(1),
  tenantId: z.string().trim().optional(),
  /** Extra ERP context merged server-side */
  context: z.record(z.string(), z.unknown()).optional(),
});

export const aiSyncQueryBodySchema = aiQueryBodySchema.extend({
  /** On gRPC failure, enqueue Redis job (proposal §11 fallback path) */
  allowAsync: z.boolean().optional(),
});

export const aiJobEnqueueBodySchema = z.object({
  tenantId: z.string().trim().optional(),
  userId: z.string().trim().optional(),
  type: aiJobTypeSchema,
  query: z.string().trim().min(1),
  context: z.record(z.string(), z.unknown()).optional(),
});

export type AiJobType = z.infer<typeof aiJobTypeSchema>;
export type AiQueryBody = z.infer<typeof aiQueryBodySchema>;
export type AiSyncQueryBody = z.infer<typeof aiSyncQueryBodySchema>;
export type AiJobEnqueueBody = z.infer<typeof aiJobEnqueueBodySchema>;
