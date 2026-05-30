import type { HitlActionKind } from "@servexa-warranty-ai/ai-contracts";

/** Workflows that have server handlers and may create HITL requests. */
export const EXECUTABLE_WORKFLOW_KINDS = new Set<HitlActionKind>([
  "repair_escalation",
  "technician_assignment",
  "customer_response_draft",
]);

export function isExecutableWorkflowKind(
  kind: string | undefined,
): kind is HitlActionKind {
  return Boolean(kind && EXECUTABLE_WORKFLOW_KINDS.has(kind as HitlActionKind));
}
