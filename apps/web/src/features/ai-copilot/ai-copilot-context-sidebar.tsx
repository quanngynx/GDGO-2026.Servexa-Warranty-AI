import { X } from "lucide-react";

import { Button } from "@servexa-warranty-ai/ui/components/button";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";

import { CopilotRailHeader } from "./components/copilot-rail-header";
import { ServexaCopilotContextPanels } from "./components/servexa-copilot-side-panels";
import type { ServexaCopilotPanel } from "./hooks/use-servexa-copilot-panel";

type AICopilotContextSidebarProps = {
  panel: ServexaCopilotPanel;
  onClose: () => void;
  className?: string;
};

export function AICopilotContextSidebar({
  panel,
  onClose,
  className,
}: AICopilotContextSidebarProps) {
  const { operational, isRunning, railMeta, combinedError, pendingCount } = panel;

  return (
    <aside
      id="ai-copilot-context-panel"
      aria-label="Copilot context and approvals"
      className={cn(
        "ai-copilot-context-panel flex min-h-0 shrink-0 flex-col overflow-hidden border-l border-border bg-background/95 backdrop-blur-sm",
        "max-lg:max-h-[38vh] max-lg:w-full max-lg:border-b",
        "lg:h-full lg:w-[340px] lg:max-w-[32vw] lg:border-b-0",
        className,
      )}
    >
      <div className="relative shrink-0 border-b border-border">
        <CopilotRailHeader
          operational={operational}
          isRunning={isRunning}
          railMeta={railMeta}
          runError={combinedError}
          pendingApprovalCount={pendingCount}
          showTitle={false}
          className="border-0 pe-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 size-7 shrink-0"
          onClick={onClose}
          aria-label="Close context panel"
        >
          <X className="size-4" />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-2 py-2">
        <ServexaCopilotContextPanels panel={panel} />
      </div>
    </aside>
  );
}
