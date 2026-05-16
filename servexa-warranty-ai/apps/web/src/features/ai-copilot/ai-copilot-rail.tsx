import {
  useAgentContext,
  useConfigureSuggestions,
  useCopilotKit,
} from "@copilotkit/react-core/v2";
import { useNavigate } from "@tanstack/react-router";
import { ExternalLink, MessageSquare, MessageSquareX, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@servexa-warranty-ai/ui/components/button";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";

import { CopilotRailHeader } from "./components/copilot-rail-header";
import { EvidencePanel } from "./components/evidence-panel";
import {
  OPERATIONAL_QUICK_PROMPTS,
} from "./components/quick-prompt-grid";
import { ServexaCopilotChat } from "./components/servexa-copilot-chat";
import { SuggestedActionsPanel } from "./components/suggested-actions";
import {
  SERVEXA_COPILOT_AGENT_ID,
  SERVEXA_COPILOT_QUICK_PROMPT_EVENT,
} from "./constants";
import { useOperationalPageContext } from "./hooks/use-operational-context";
import { useServexaCopilotRail } from "./hooks/use-servexa-copilot-rail-metadata";
import { getLastUserMessageText } from "./lib/agent-message-text";

export function AICopilotRail() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const operational = useOperationalPageContext();
  const { agent, railMeta, isRunning, runError, clearRunError } =
    useServexaCopilotRail(SERVEXA_COPILOT_AGENT_ID);

  useAgentContext({
    description: "Current Servexa UI context for warranty operations copilot",
    value: operational,
  });

  useConfigureSuggestions({
    suggestions: OPERATIONAL_QUICK_PROMPTS.map((p) => ({
      title: p.title,
      message: p.message,
    })),
    available: "always",
  });

  const { copilotkit } = useCopilotKit();

  const [chatError, setChatError] = useState<string | null>(null);

  const onQuickPrompt = useCallback(
    (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (!detail?.trim()) return;
      clearRunError();
      setChatError(null);
      const id = crypto.randomUUID();
      agent.addMessage({
        id,
        role: "user",
        content: detail,
      });
      void (async () => {
        await copilotkit.waitForPendingFrameworkUpdates();
        await copilotkit.runAgent({ agent });
      })();
    },
    [agent, copilotkit, clearRunError],
  );

  useEffect(() => {
    window.addEventListener(SERVEXA_COPILOT_QUICK_PROMPT_EVENT, onQuickPrompt);
    return () => {
      window.removeEventListener(
        SERVEXA_COPILOT_QUICK_PROMPT_EVENT,
        onQuickPrompt,
      );
    };
  }, [onQuickPrompt]);

  const combinedError = runError ?? chatError;
  const lastUserText = getLastUserMessageText(agent);

  const handleRetryLast = useCallback(async () => {
    clearRunError();
    setChatError(null);
    if (!lastUserText.trim()) return;
    void (async () => {
      await copilotkit.waitForPendingFrameworkUpdates();
      await copilotkit.runAgent({ agent });
    })();
  }, [agent, clearRunError, copilotkit, lastUserText]);

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
            <>
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
            </>
          )}
          {collapsed ? null : (
            <>
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
            </>
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
              <MessageSquare className="size-4" fill="#ccc" strokeWidth={0}/>
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
          />
          <div className="min-h-0 flex-1 px-1 pt-1">
            <ServexaCopilotChat
              agentId={SERVEXA_COPILOT_AGENT_ID}
              className="h-full min-h-[280px] rounded-lg border border-border/60"
              onChatError={(msg) => setChatError(msg)}
              onRetryLast={handleRetryLast}
            />
          </div>
          <SuggestedActionsPanel actions={railMeta?.suggestedActions} />
          <EvidencePanel sources={railMeta?.sources} />
        </div>
      ) : null}
    </aside>
  );
}
