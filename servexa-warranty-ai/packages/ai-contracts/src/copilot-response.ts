import { z } from "zod";

export const copilotEvidenceSourceTypeSchema = z.enum([
  "manual",
  "repair_case",
  "policy",
  "inventory",
]);

export const copilotEvidenceSourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: copilotEvidenceSourceTypeSchema,
  excerpt: z.string().optional(),
});

export const copilotSuggestedActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  action: z.string(),
});

export const copilotRelatedEntitySchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string(),
});

/** Full unary/copilot completion shape (answer + optional intelligence fields). */
export const copilotResponseSchema = z.object({
  answer: z.string(),
  confidence: z.number().min(0).max(1).optional(),
  sources: z.array(copilotEvidenceSourceSchema).optional(),
  suggestedActions: z.array(copilotSuggestedActionSchema).optional(),
  relatedEntities: z.array(copilotRelatedEntitySchema).optional(),
});

/** Structured fields surfaced in the rail (no duplicate answer text). */
export const copilotRailMetadataSchema = z.object({
  confidence: z.number().min(0).max(1).optional(),
  sources: z.array(copilotEvidenceSourceSchema).optional(),
  suggestedActions: z.array(copilotSuggestedActionSchema).optional(),
  relatedEntities: z.array(copilotRelatedEntitySchema).optional(),
  backend: z.enum(["grpc", "gemini_node"]).optional(),
});

export type CopilotEvidenceSourceType = z.infer<typeof copilotEvidenceSourceTypeSchema>;
export type CopilotEvidenceSource = z.infer<typeof copilotEvidenceSourceSchema>;
export type CopilotSuggestedAction = z.infer<typeof copilotSuggestedActionSchema>;
export type CopilotRelatedEntity = z.infer<typeof copilotRelatedEntitySchema>;
export type CopilotResponse = z.infer<typeof copilotResponseSchema>;
export type CopilotRailMetadata = z.infer<typeof copilotRailMetadataSchema>;
