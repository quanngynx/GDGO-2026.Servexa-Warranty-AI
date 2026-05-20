import { useMemo } from "react";

import { cn } from "@servexa-warranty-ai/ui/lib/utils";

import type { ServexaCopilotPanel } from "../hooks/use-servexa-copilot-panel";
import { deriveWorkflowProgress } from "../lib/derive-workflow-progress";
import { CopilotRailHeader } from "./copilot-rail-header";
import { DiagnosisDraftCard } from "./diagnosis-draft-card";
import { HitlApprovalList } from "./hitl-approval-list";
import { LastDecisionSummaryCard } from "./last-decision-summary-card";
import { SuggestedActionsPanel } from "./suggested-actions";
import { WarrantyEligibilityCard } from "./warranty-eligibility-card";
import { WorkflowProgressCard } from "./workflow-progress-card";

type ServexaCopilotContextPanelsProps = {
  panel: ServexaCopilotPanel;
  className?: string;
};

export function ServexaCopilotContextPanels({
  panel,
  className,
}: ServexaCopilotContextPanelsProps) {
  const {
    operational,
    railMeta,
    pendingApprovals,
    hitl,
    hitlDecision,
    handleApprove,
    handleReject,
    handleEdit,
    handleCreateWorkflowRequest,
    lastDecision,
  } = panel;

  const workflowProgress = useMemo(
    () =>
      deriveWorkflowProgress({
        railMeta,
        operational,
        pendingApprovalsCount: pendingApprovals.length,
      }),
    [railMeta, operational, pendingApprovals.length],
  );

  return (
    <div className={cn("flex min-h-0 flex-col gap-1", className)}>
      {railMeta?.warrantyEligibility ? (
        <WarrantyEligibilityCard eligibility={railMeta.warrantyEligibility} />
      ) : null}
      {railMeta?.diagnosisDraft ? (
        <DiagnosisDraftCard diagnosis={railMeta.diagnosisDraft} />
      ) : null}
      {workflowProgress ? <WorkflowProgressCard progress={workflowProgress} /> : null}
      {lastDecision || railMeta?.lastDecision ? (
        <LastDecisionSummaryCard lastDecision={lastDecision ?? railMeta!.lastDecision!} />
      ) : null}
      <HitlApprovalList
        pending={pendingApprovals}
        decided={hitl.decided}
        isSubmitting={hitl.isSubmitting || hitlDecision.isSubmitting}
        error={hitl.error ?? hitlDecision.error}
        onApprove={handleApprove}
        onReject={handleReject}
        onEdit={handleEdit}
      />
      <SuggestedActionsPanel
        actions={railMeta?.suggestedActions}
        operational={operational}
        onCreateWorkflowRequest={handleCreateWorkflowRequest}
      />
    </div>
  );
}

type ServexaCopilotSidebarProps = {
  panel: ServexaCopilotPanel;
  className?: string;
  variant?: "rail" | "fullPage";
};

export function ServexaCopilotSidebar({
  panel,
  className,
  variant = "rail",
}: ServexaCopilotSidebarProps) {
  const { operational, isRunning, railMeta, combinedError, pendingCount } = panel;
  const isFullPage = variant === "fullPage";

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col",
        isFullPage && "h-full overflow-y-auto px-3 py-2",
        className,
      )}
    >
      <div
        className={cn(
          isFullPage &&
            "sticky top-0 z-10 -mx-3 mb-2 border-b border-border bg-background/95 px-3 py-2 backdrop-blur-sm",
        )}
      >
        <CopilotRailHeader
          operational={operational}
          isRunning={isRunning}
          railMeta={railMeta}
          runError={combinedError}
          pendingApprovalCount={pendingCount}
          showTitle={!isFullPage}
          className={isFullPage ? "border-0 px-0 py-0" : undefined}
        />
      </div>
      <ServexaCopilotContextPanels panel={panel} />
    </div>
  );
}
