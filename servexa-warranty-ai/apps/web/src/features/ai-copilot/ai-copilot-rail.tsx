import { useNavigate } from "@tanstack/react-router";
import {
  ExternalLink,
  MessageSquare,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@servexa-warranty-ai/ui/components/button";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";

import { CopilotRailHeader } from "./components/copilot-rail-header";
import { ServexaCopilotChat } from "./components/servexa-copilot-chat";
import { ServexaCopilotContextPanels } from "./components/servexa-copilot-side-panels";
import { SERVEXA_COPILOT_AGENT_ID } from "./constants";
import { useServexaCopilotPanel } from "./hooks/use-servexa-copilot-panel";

export function AICopilotRail() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const panel = useServexaCopilotPanel(SERVEXA_COPILOT_AGENT_ID);
  const {
    operational,
    isRunning,
    railMeta,
    combinedError,
    pendingCount,
    handleRetryLast,
    setChatErrorMessage,
  } = panel;

  return (
    <aside
      className={cn(
        "ai-copilot-panel sticky top-0 z-20 flex h-svh max-h-svh shrink-0 flex-col self-start border-l border-border bg-background/95 backdrop-blur-sm transition-[width]",
        collapsed ? "w-12" : "w-[min(100%,420px)]",
      )}
      aria-label="AI Copilot"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-2 py-2">
        {!collapsed ? (
          <span className="truncate ps-1 text-sm font-semibold tracking-tight">
            Assistant AI
          </span>
        ) : (
          <span className="sr-only">Copilot collapsed</span>
        )}
        <div className="flex items-center gap-2">
          {collapsed ? null : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => navigate({ to: "/ai/gemini" })}
              aria-label="Open full-screen Gemini chat"
            >
              <ExternalLink className="size-4" />
            </Button>
          )}
          {collapsed ? null : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => setCollapsed((c) => !c)}
              aria-expanded={!collapsed}
              aria-controls="ai-copilot-panel"
            >
              {collapsed ? (
                <PanelRightOpen className="size-4" />
              ) : (
                <PanelRightClose className="size-4" />
              )}
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
            aria-controls="ai-copilot-panel"
            aria-label={collapsed ? "Open chat" : "Close chat"}
          >
            {collapsed ? (
              <MessageSquare className="size-4" />
            ) : (
              <MessageSquare className="size-4" fill="#ccc" strokeWidth={0} />
            )}
          </Button>
        </div>
      </div>

      {!collapsed ? (
        <div
          id="ai-copilot-panel"
          className="flex min-h-0 min-w-0 flex-1 flex-col"
        >
          <CopilotRailHeader
            operational={operational}
            isRunning={isRunning}
            railMeta={railMeta}
            runError={combinedError}
            pendingApprovalCount={pendingCount}
          />
          <div className="min-h-0 flex-1 px-1 pt-1">
            <ServexaCopilotChat
              agentId={SERVEXA_COPILOT_AGENT_ID}
              className="h-full min-h-[280px] rounded-lg border border-border/60"
              onChatError={setChatErrorMessage}
              onRetryLast={handleRetryLast}
            />
          </div>
          <ServexaCopilotContextPanels panel={panel} />
        </div>
      ) : null}
    </aside>
  );
}
