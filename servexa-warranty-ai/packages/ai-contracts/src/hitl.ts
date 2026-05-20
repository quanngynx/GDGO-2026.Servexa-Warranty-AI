import { z } from "zod";

export const hitlRequestStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "edited",
  "expired",
  "executed",
  "failed",
]);

export const hitlActionKindSchema = z.enum([
  "repair_escalation",
  "technician_assignment",
  "customer_response_draft",
  "part_order_request",
  "warranty_exception",
]);

export const hitlDecisionTypeSchema = z.enum(["approve", "reject", "edit"]);

export const hitlRiskLevelSchema = z.enum(["low", "medium", "high", "critical"]);

export const hitlApprovalOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  decision: hitlDecisionTypeSchema,
});

export const hitlRequestSchema = z.object({
  id: z.string(),
  kind: hitlActionKindSchema,
  title: z.string(),
  description: z.string(),
  status: hitlRequestStatusSchema,
  riskLevel: hitlRiskLevelSchema.optional(),
  confidence: z.number().min(0).max(1).optional(),
  payload: z.record(z.string(), z.unknown()),
  approvalOptions: z.array(hitlApprovalOptionSchema),
  evidenceSourceIds: z.array(z.string()).optional(),
  repairCaseId: z.string().nullable().optional(),
  langGraphThreadId: z.string().nullable().optional(),
  langGraphRunId: z.string().nullable().optional(),
  langGraphCheckpointId: z.string().nullable().optional(),
  createdAt: z.string(),
  decidedAt: z.string().nullable().optional(),
  executedAt: z.string().nullable().optional(),
});

export const hitlGraphInterruptMetadataSchema = z.object({
  humanApprovalRequired: z.boolean().optional(),
  threadId: z.string().optional(),
  runId: z.string().optional(),
  checkpointId: z.string().optional(),
  approvalRequestId: z.string().optional(),
});

export const hitlResumeResponseSchema = z.object({
  request: hitlRequestSchema,
  agentOutput: z.string(),
  metadataJson: z.string().optional(),
});

export const hitlDecisionSchema = z.object({
  requestId: z.string(),
  decision: hitlDecisionTypeSchema,
  editedPayload: z.record(z.string(), z.unknown()).optional(),
  reason: z.string().optional(),
});

export const repairEscalationPayloadSchema = z.object({
  repairCaseId: z.string(),
  caseNumber: z.string().optional(),
  reason: z.string().optional(),
  priority: z.enum(["high", "urgent"]).default("urgent"),
});

export const technicianAssignmentPayloadSchema = z.object({
  repairCaseId: z.string(),
  caseNumber: z.string().optional(),
  technicianId: z.uuidv7().optional(),
  technicianName: z.string().optional(),
});

export const customerResponseDraftPayloadSchema = z.object({
  repairCaseId: z.string(),
  caseNumber: z.string().optional(),
  body: z.string().min(1),
  subject: z.string().optional(),
});

export type HitlRequestStatus = z.infer<typeof hitlRequestStatusSchema>;
export type HitlActionKind = z.infer<typeof hitlActionKindSchema>;
export type HitlDecisionType = z.infer<typeof hitlDecisionTypeSchema>;
export type HitlRiskLevel = z.infer<typeof hitlRiskLevelSchema>;
export type HitlApprovalOption = z.infer<typeof hitlApprovalOptionSchema>;
export type HitlRequest = z.infer<typeof hitlRequestSchema>;
export type HitlDecision = z.infer<typeof hitlDecisionSchema>;
export type HitlGraphInterruptMetadata = z.infer<typeof hitlGraphInterruptMetadataSchema>;
export type HitlResumeResponse = z.infer<typeof hitlResumeResponseSchema>;

export const DEFAULT_HITL_APPROVAL_OPTIONS: HitlApprovalOption[] = [
  { id: "approve", label: "Approve", decision: "approve" },
  { id: "reject", label: "Reject", decision: "reject" },
  { id: "edit", label: "Edit", decision: "edit" },
];

/** Valid status transitions for HITL requests. */
export function isValidHitlStatusTransition(
  from: HitlRequestStatus,
  to: HitlRequestStatus,
): boolean {
  const allowed: Record<HitlRequestStatus, HitlRequestStatus[]> = {
    pending: ["approved", "rejected", "edited", "expired"],
    edited: ["approved", "rejected"],
    approved: ["executed", "failed"],
    rejected: [],
    expired: [],
    executed: [],
    failed: [],
  };
  return allowed[from]?.includes(to) ?? false;
}
