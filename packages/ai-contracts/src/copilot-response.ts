import { z } from "zod";

import { hitlActionKindSchema, hitlRequestSchema } from "./hitl";
import {
  reasoningTraceEventSchema,
  reasoningTraceSchema,
  type ReasoningTrace,
  type ReasoningTraceEvent,
} from "./reasoning-trace";

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
  kind: z.enum(["prompt", "workflow"]).default("prompt"),
  workflowKind: hitlActionKindSchema.optional(),
  requiresApproval: z.boolean().default(false),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export const copilotRelatedEntitySchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string(),
});

export const selectedCaseSummarySchema = z.object({
  repairCaseId: z.string(),
  caseNumber: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  productModel: z.string().nullable().optional(),
  modelCode: z.string().nullable().optional(),
  serialNumber: z.string().optional(),
  warrantyForm: z.string().nullable().optional(),
  warrantyServiceType: z.string().nullable().optional(),
  errorPhenomena: z.string().nullable().optional(),
  promisedDeliveryDate: z.string().nullable().optional(),
});

export const warrantyEligibilitySchema = z.object({
  status: z.enum(["eligible", "not_eligible", "unknown"]),
  reason: z.string(),
  warrantyForm: z.string().nullable().optional(),
  warrantyServiceType: z.string().nullable().optional(),
  confidence: z.number().min(0).max(1).optional(),
});

export const diagnosisDraftSchema = z.object({
  symptoms: z.array(z.string()).default([]),
  possibleCauses: z.array(z.string()).default([]),
  recommendedChecks: z.array(z.string()).default([]),
  severity: z.enum(["low", "medium", "high"]),
});

export const workflowProgressStepSchema = z.object({
  key: z.string(),
  label: z.string(),
  status: z.enum(["done", "active", "pending", "failed"]),
});

export const workflowProgressSchema = z.object({
  currentStep: z.string(),
  steps: z.array(workflowProgressStepSchema),
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
  pendingApprovals: z.array(hitlRequestSchema).optional(),
  workflowExecutionStatus: z
    .enum(["idle", "awaiting_approval", "executed", "failed"])
    .optional(),
  lastDecision: z
    .object({
      requestId: z.string(),
      decision: z.enum(["approve", "reject", "edit"]),
      status: z.string(),
      kind: z.string().optional(),
      repairCaseId: z.string().optional(),
      summary: z.string().optional(),
    })
    .optional(),
  selectedCaseSummary: selectedCaseSummarySchema.optional(),
  warrantyEligibility: warrantyEligibilitySchema.optional(),
  diagnosisDraft: diagnosisDraftSchema.optional(),
  workflowProgress: workflowProgressSchema.optional(),
  reasoningTrace: reasoningTraceSchema.optional(),
  latestReasoningEvent: reasoningTraceEventSchema.optional(),
  backend: z.enum(["grpc", "gemini_node"]).optional(),
});

export type CopilotEvidenceSourceType = z.infer<typeof copilotEvidenceSourceTypeSchema>;
export type CopilotEvidenceSource = z.infer<typeof copilotEvidenceSourceSchema>;
export type CopilotSuggestedAction = z.infer<typeof copilotSuggestedActionSchema>;
export type CopilotRelatedEntity = z.infer<typeof copilotRelatedEntitySchema>;
export type SelectedCaseSummary = z.infer<typeof selectedCaseSummarySchema>;
export type WarrantyEligibility = z.infer<typeof warrantyEligibilitySchema>;
export type DiagnosisDraft = z.infer<typeof diagnosisDraftSchema>;
export type WorkflowProgressStep = z.infer<typeof workflowProgressStepSchema>;
export type WorkflowProgress = z.infer<typeof workflowProgressSchema>;
export type CopilotResponse = z.infer<typeof copilotResponseSchema>;
export type CopilotRailMetadata = z.infer<typeof copilotRailMetadataSchema>;

export type { ReasoningTrace, ReasoningTraceEvent };
