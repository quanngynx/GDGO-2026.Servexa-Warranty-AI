import { useNavigate } from "@tanstack/react-router";
import {
  ExternalLink,
  LayoutPanelLeft,
  MessageSquare,
  PanelRightClose,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@servexa-warranty-ai/ui/components/button";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";

import { AICopilotContextSidebar } from "./ai-copilot-context-sidebar";
import { CopilotRailHeader } from "./components/copilot-rail-header";
import { ServexaCopilotChat } from "./components/servexa-copilot-chat";
import { SERVEXA_COPILOT_AGENT_ID } from "./constants";
import type { ServexaCopilotPanel } from "./hooks/use-servexa-copilot-panel";
import { useServexaCopilotPanel } from "./hooks/use-servexa-copilot-panel";
import { useTranslation } from "react-i18next";

type AICopilotChatRailProps = {
  panel: ServexaCopilotPanel;
  collapsed: boolean;
  contextOpen: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onContextOpenChange: (open: boolean) => void;
};

function AICopilotChatRail({
  panel,
  collapsed,
  contextOpen,
  onCollapsedChange,
  onContextOpenChange,
}: AICopilotChatRailProps) {
    const { t } = useTranslation();
  const navigate = useNavigate();
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
        "ai-copilot-panel flex min-h-0 shrink-0 flex-col overflow-hidden border-l border-border bg-background/95 backdrop-blur-sm",
        collapsed ? "w-12" : "w-[min(100%,420px)] max-lg:flex-1 lg:w-[420px]",
      )}
      aria-label="AI Copilot chat"
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-2 py-2">
        {!collapsed ? (
          <span className="truncate ps-1 text-sm font-semibold tracking-tight">{t("Assistant AI")}</span>
        ) : (
          <span className="sr-only">{t("Copilot collapsed")}</span>
        )}
        <div className="flex items-center gap-2">
          {!collapsed && !contextOpen ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => onContextOpenChange(true)}
              aria-label="Open context panel"
              aria-expanded={contextOpen}
              aria-controls="ai-copilot-context-panel"
            >
              <LayoutPanelLeft className="size-4" />
            </Button>
          ) : null}
          {!collapsed ? (
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
          ) : null}
          {!collapsed ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => {
                onContextOpenChange(false);
                onCollapsedChange(true);
              }}
              aria-expanded={!collapsed}
              aria-controls="ai-copilot-panel"
              aria-label="Collapse chat rail"
            >
              <PanelRightClose className="size-4" />
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => onCollapsedChange(!collapsed)}
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
        <div id="ai-copilot-panel" className="flex min-h-0 min-w-0 flex-1 flex-col">
          <CopilotRailHeader
            operational={operational}
            isRunning={isRunning}
            railMeta={railMeta}
            runError={combinedError}
            pendingApprovalCount={pendingCount}
          />
          <div className="min-h-0 flex-1 px-1 pt-1 pb-2">
            <ServexaCopilotChat
              agentId={SERVEXA_COPILOT_AGENT_ID}
              className="h-full min-h-[280px] rounded-lg border border-border/60"
              sources={railMeta?.sources}
              onChatError={setChatErrorMessage}
              onRetryLast={handleRetryLast}
            />
          </div>
        </div>
      ) : null}
    </aside>
  );
}

export function AICopilotRail() {
    const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("servexa-copilot-collapsed");
      if (stored !== null) {
        return stored === "true";
      }
    }
    return true;
  });
  const [contextOpen, setContextOpen] = useState(false);
  const panel = useServexaCopilotPanel(SERVEXA_COPILOT_AGENT_ID);

  const handleCollapsedChange = (next: boolean) => {
    setCollapsed(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("servexa-copilot-collapsed", String(next));
    }
    if (next) setContextOpen(false);
  };

  return (
    <div
      className={cn(
        "ai-copilot-dock sticky top-0 z-20 flex min-h-0 shrink-0 overflow-hidden",
        collapsed && "ai-copilot-dock--collapsed",
        collapsed
          ? "h-svh w-12"
          : contextOpen
            ? "h-svh max-lg:w-full max-lg:flex-col lg:w-[760px] lg:max-w-[min(100%,72vw)] lg:flex-row lg:flex-nowrap"
            : "h-svh max-lg:w-full max-lg:flex-col lg:w-[420px] lg:flex-row lg:flex-nowrap",
      )}
    >
      {!collapsed && contextOpen ? (
        <AICopilotContextSidebar
          panel={panel}
          onClose={() => setContextOpen(false)}
        />
      ) : null}
      <AICopilotChatRail
        panel={panel}
        collapsed={collapsed}
        contextOpen={contextOpen}
        onCollapsedChange={handleCollapsedChange}
        onContextOpenChange={setContextOpen}
      />
    </div>
  );
}
