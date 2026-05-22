import type { CopilotRailMetadata, WorkflowProgress } from "@servexa-warranty-ai/ai-contracts";

import type { OperationalPageContext } from "../hooks/use-operational-context";
import { toSelectedCaseSummary } from "./to-selected-case-summary";

type DeriveInput = {
  railMeta: CopilotRailMetadata | undefined;
  operational: OperationalPageContext;
  pendingApprovalsCount: number;
};

export function deriveWorkflowProgress(input: DeriveInput): WorkflowProgress | undefined {
  const { railMeta, operational, pendingApprovalsCount } = input;
  const selected =
    railMeta?.selectedCaseSummary ?? toSelectedCaseSummary(operational) ?? undefined;

  if (!selected) return undefined;

  const hasWarranty = Boolean(railMeta?.warrantyEligibility);
  const hasDiagnosis = Boolean(railMeta?.diagnosisDraft);
  const hasActions = (railMeta?.suggestedActions?.length ?? 0) > 0;
  const awaitingApproval =
    pendingApprovalsCount > 0 || railMeta?.workflowExecutionStatus === "awaiting_approval";
  const executed =
    railMeta?.lastDecision?.status === "executed" ||
    railMeta?.workflowExecutionStatus === "executed";
  const failed =
    railMeta?.workflowExecutionStatus === "failed" ||
    railMeta?.lastDecision?.status === "failed";

  type StepStatus = WorkflowProgress["steps"][number]["status"];

  const step = (done: boolean, active: boolean, failedStep = false): StepStatus => {
    if (failedStep) return "failed";
    if (active) return "active";
    if (done) return "done";
    return "pending";
  };

  const steps: WorkflowProgress["steps"] = [
    { key: "case_selected", label: "Case selected", status: "done" },
    {
      key: "warranty_checked",
      label: "Warranty checked",
      status: step(hasWarranty, !hasWarranty && hasDiagnosis),
    },
    {
      key: "diagnosis_drafted",
      label: "Diagnosis drafted",
      status: step(hasDiagnosis, hasWarranty && !hasDiagnosis),
    },
    {
      key: "actions_suggested",
      label: "Actions suggested",
      status: step(hasActions, hasDiagnosis && !hasActions && !awaitingApproval),
    },
    {
      key: "awaiting_approval",
      label: "Awaiting approval",
      status: step(awaitingApproval || executed, awaitingApproval, failed && awaitingApproval),
    },
    {
      key: "executed",
      label: "Workflow executed",
      status: step(executed, false, failed),
    },
  ];

  let currentStep = "case_selected";
  if (failed) currentStep = "awaiting_approval";
  else if (executed) currentStep = "executed";
  else if (awaitingApproval) currentStep = "awaiting_approval";
  else if (hasActions) currentStep = "actions_suggested";
  else if (hasDiagnosis) currentStep = "diagnosis_drafted";
  else if (hasWarranty) currentStep = "warranty_checked";

  return { currentStep, steps };
}
