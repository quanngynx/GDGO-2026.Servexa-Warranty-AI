import { z } from "zod";

import {
  hitlActionKindSchema,
  hitlDecisionSchema,
  hitlRiskLevelSchema,
} from "@servexa-warranty-ai/ai-contracts";

export const createHitlRequestBodySchema = z.object({
  kind: hitlActionKindSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  payload: z.record(z.string(), z.unknown()),
  evidenceSourceIds: z.array(z.string()).optional(),
  confidence: z.number().min(0).max(1).optional(),
  riskLevel: hitlRiskLevelSchema.optional(),
  langGraphThreadId: z.string().optional(),
  langGraphRunId: z.string().optional(),
  langGraphCheckpointId: z.string().optional(),
});

export const listHitlRequestsQuerySchema = z.object({
  status: z.enum(["pending"]).optional(),
  scope: z.enum(["mine", "asc", "all"]).default("mine"),
});

export const hitlRequestIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const submitHitlDecisionBodySchema = hitlDecisionSchema.omit({ requestId: true });

export type SubmitHitlDecisionInput = z.infer<typeof submitHitlDecisionBodySchema>;
