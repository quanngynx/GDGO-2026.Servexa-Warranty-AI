import { z } from "zod";

export const reasoningTraceIdParamsSchema = z.object({
  traceId: z.uuidv7(),
});

export const reasoningTraceListQuerySchema = z.object({
  repairCaseId: z.uuidv7().optional(),
});

