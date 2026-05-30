import type { AiHumanApprovalRequest } from "@servexa-warranty-ai/db/prisma/client";
import {
  DEFAULT_HITL_APPROVAL_OPTIONS,
  type HitlActionKind,
  type HitlRequest,
  type HitlRequestStatus,
  type HitlRiskLevel,
} from "@servexa-warranty-ai/ai-contracts";

export function toHitlRequest(row: AiHumanApprovalRequest): HitlRequest {
  const payload =
    row.payloadJson && typeof row.payloadJson === "object" && !Array.isArray(row.payloadJson)
      ? (row.payloadJson as Record<string, unknown>)
      : {};

  return {
    id: row.id,
    kind: row.kind as HitlActionKind,
    title: row.title,
    description: row.description,
    status: row.status as HitlRequestStatus,
    riskLevel: row.riskLevel ? (row.riskLevel as HitlRiskLevel) : undefined,
    confidence: row.confidence ?? undefined,
    payload,
    approvalOptions: DEFAULT_HITL_APPROVAL_OPTIONS,
    repairCaseId: row.repairCaseId,
    langGraphThreadId: row.langGraphThreadId,
    langGraphRunId: row.langGraphRunId,
    langGraphCheckpointId: row.langGraphCheckpointId,
    createdAt: row.createdAt.toISOString(),
    decidedAt: row.decidedAt?.toISOString() ?? null,
    executedAt: row.executedAt?.toISOString() ?? null,
  };
}
