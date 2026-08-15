import type { CopilotSuggestedAction } from "@servexa-warranty-ai/ai-contracts";

import { Button } from "@servexa-warranty-ai/ui/components/button";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import { useEffect, useMemo, useState } from "react";

import { SERVEXA_COPILOT_QUICK_PROMPT_EVENT } from "../constants";
import type { OperationalPageContext } from "../hooks/use-operational-context";
import { buildHitlCreateInput } from "../lib/build-hitl-request";
import { isExecutableWorkflowKind } from "../lib/executable-workflow-kinds";
import type { CreateHitlRequestInput } from "@/libs/api/ai/hitl/api";
import { useTranslation } from "react-i18next";

function dispatchCopilotActionPrompt(action: string): void {
  const body = action.startsWith("prompt:") ? action.slice("prompt:".length).trim() : action.trim();
  if (!body) return;
  window.dispatchEvent(new CustomEvent(SERVEXA_COPILOT_QUICK_PROMPT_EVENT, { detail: body }));
}

type SuggestedActionsPanelProps = {
  actions: CopilotSuggestedAction[] | undefined;
  operational: OperationalPageContext;
  onCreateWorkflowRequest: (input: CreateHitlRequestInput) => void;
  className?: string;
};

export function SuggestedActionsPanel({
  actions,
  operational,
  onCreateWorkflowRequest,
  className,
}: SuggestedActionsPanelProps) {
    const { t } = useTranslation();
  if (!actions?.length) {
    return (
      <div className={cn("border-t border-border px-3 py-2 text-xs text-muted-foreground", className)}>
        {t("Suggested actions will appear when the gateway returns structured recommendations.")}</div>
    );
  }

  const visibleActions = useMemo(() => actions, [actions]);

  const handleClick = (action: CopilotSuggestedAction) => {
    const wantsWorkflow =
      action.kind === "workflow" || action.requiresApproval === true;

    if (wantsWorkflow && action.workflowKind === "warranty_exception") {
      dispatchCopilotActionPrompt(
        action.action.startsWith("prompt:")
          ? action.action
          : `prompt:${action.label} — explain warranty exception options for this case without creating an approval yet.`,
      );
      return;
    }

    if (wantsWorkflow && !isExecutableWorkflowKind(action.workflowKind)) {
      dispatchCopilotActionPrompt(
        action.action.startsWith("prompt:")
          ? action.action
          : `prompt:${action.label}`,
      );
      return;
    }

    if (wantsWorkflow) {
      if (!operational.repairCaseId) {
        dispatchCopilotActionPrompt("prompt:I need to run a workflow action but no repair case is selected. What should I do?", ); return; } onCreateWorkflowRequest(buildHitlCreateInput(action, operational)); return; } dispatchCopilotActionPrompt(action.action); }; return ( <div className={cn("border-t border-border px-2 py-2", className)}> <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">{t("Suggested actions")}</p>
      <div className="flex flex-wrap gap-2 px-2 pb-1">
        {visibleActions.map((a) => (
          <Button
            key={a.id}
            type="button"
            variant={a.kind === "workflow" || a.requiresApproval ? "default" : "secondary"}
            size="sm"
            className="h-auto max-w-full whitespace-normal text-left text-xs"
            onClick={() => handleClick(a)}
          >
            {a.label}
            {a.kind === "workflow" || a.requiresApproval ? (
              <span className="ms-1 text-[10px] opacity-80">{t("· approval")}</span>
            ) : null}
          </Button>
        ))}
      </div>
    </div>
  );
}
