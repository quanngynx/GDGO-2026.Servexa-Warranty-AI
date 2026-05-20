import type { CopilotSuggestedAction, HitlActionKind } from "@servexa-warranty-ai/ai-contracts";

import type { OperationalPageContext } from "../hooks/use-operational-context";

const WORKFLOW_COPY: Record<
  HitlActionKind,
  { title: string; description: string; defaultPayload: (ctx: OperationalPageContext) => Record<string, unknown> }
> = {
  repair_escalation: {
    title: "Escalate repair case",
    description: "Raise priority and record escalation reason for SLA risk.",
    defaultPayload: (ctx) => ({
      repairCaseId: ctx.repairCaseId ?? "",
      caseNumber: ctx.caseNumber ?? undefined,
      reason: "SLA risk identified by operations copilot",
      priority: "urgent",
    }),
  },
  technician_assignment: {
    title: "Assign technician",
    description: "Assign a technician to this repair case.",
    defaultPayload: (ctx) => ({
      repairCaseId: ctx.repairCaseId ?? "",
      caseNumber: ctx.caseNumber ?? undefined,
      technicianId: ctx.technicianId ?? "",
      technicianName: undefined,
    }),
  },
  customer_response_draft: {
    title: "Draft customer response",
    description: "Save a draft message for customer communication (not sent automatically).",
    defaultPayload: (ctx) => ({
      repairCaseId: ctx.repairCaseId ?? "",
      caseNumber: ctx.caseNumber ?? undefined,
      body: "Thank you for your patience. We are reviewing your warranty case and will update you shortly.",
      subject: "Warranty service update",
    }),
  },
  part_order_request: {
    title: "Request part order",
    description: "Create a parts order request for this case.",
    defaultPayload: (ctx) => ({ repairCaseId: ctx.repairCaseId ?? "" }),
  },
  warranty_exception: {
    title: "Warranty exception",
    description: "Request a warranty policy exception.",
    defaultPayload: (ctx) => ({ repairCaseId: ctx.repairCaseId ?? "" }),
  },
};

export function buildHitlCreateInput(
  action: CopilotSuggestedAction,
  operational: OperationalPageContext,
) {
  const kind = (action.workflowKind ?? "repair_escalation") as HitlActionKind;
  const copy = WORKFLOW_COPY[kind];
  const basePayload = copy.defaultPayload(operational);
  const payload = { ...basePayload, ...(action.payload ?? {}) };

  const caseRef = operational.caseNumber ?? operational.repairCaseId ?? "selected case";

  return {
    kind,
    title: `${copy.title}${operational.repairCaseId ? ` (${caseRef})` : ""}`,
    description: action.label || copy.description,
    payload,
    riskLevel: "high" as const,
    confidence: 0.85,
  };
}
