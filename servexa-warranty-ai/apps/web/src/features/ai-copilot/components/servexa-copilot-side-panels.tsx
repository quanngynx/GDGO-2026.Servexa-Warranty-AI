import { cn } from "@servexa-warranty-ai/ui/lib/utils";

import type { ServexaCopilotPanel } from "../hooks/use-servexa-copilot-panel";
import { CopilotRailHeader } from "./copilot-rail-header";
import { EvidencePanel } from "./evidence-panel";
import { HitlApprovalList } from "./hitl-approval-list";
import { SuggestedActionsPanel } from "./suggested-actions";

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
  } = panel;

  const highlightedSourceIds = pendingApprovals.flatMap(
    (r) => r.evidenceSourceIds ?? [],
  );

  return (
    <div className={cn("flex min-h-0 flex-col gap-1", className)}>
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
      <EvidencePanel
        sources={railMeta?.sources}
        highlightedSourceIds={highlightedSourceIds}
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
