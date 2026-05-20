import type { CopilotRailMetadata } from "@servexa-warranty-ai/ai-contracts";

/** Drop agent-produced rail slices when they belong to a different repair case. */
export function filterRailMetadataForCase(
  railMeta: CopilotRailMetadata | undefined,
  repairCaseId: string | null,
): CopilotRailMetadata | undefined {
  if (!railMeta) return undefined;
  if (!repairCaseId) return railMeta;

  const summaryId = railMeta.selectedCaseSummary?.repairCaseId;
  if (summaryId && summaryId !== repairCaseId) {
    return {
      pendingApprovals: railMeta.pendingApprovals,
      workflowExecutionStatus: railMeta.workflowExecutionStatus,
      backend: railMeta.backend,
    };
  }

  const decisionCaseId = railMeta.lastDecision?.repairCaseId;
  if (decisionCaseId && decisionCaseId !== repairCaseId) {
    const { lastDecision: _removed, ...rest } = railMeta;
    return rest;
  }

  return railMeta;
}
