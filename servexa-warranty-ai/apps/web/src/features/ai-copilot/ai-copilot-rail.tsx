import {
  CopilotChat,
  useAgent,
  useAgentContext,
  useConfigureSuggestions,
  useCopilotKit,
} from "@copilotkit/react-core/v2";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { BookOpen, ExternalLink, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@servexa-warranty-ai/ui/components/collapsible";
import { Button } from "@servexa-warranty-ai/ui/components/button";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";

import { SERVEXA_COPILOT_AGENT_ID, SERVEXA_COPILOT_QUICK_PROMPT_EVENT } from "./constants";

const SUGGESTIONS = [
  { title: "Summarize this repair case", message: "Summarize this repair case for a technician handoff." },
  { title: "Explain warranty eligibility", message: "Explain warranty eligibility for the current context." },
  { title: "Find similar failures", message: "Find similar failures and likely root causes." },
  { title: "Supply chain risk", message: "Detect supply chain risk for parts on this case." },
] as const;

export function AICopilotRail() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const pageContext = useMemo(
    () => ({
      currentRoute: pathname,
      repairCaseId: null as string | null,
      technicianId: null as string | null,
      customerId: null as string | null,
      productModel: null as string | null,
      warrantyStatus: null as string | null,
      currentUserRole: null as string | null,
    }),
    [pathname],
  );

  useAgentContext({
    description: "Current Servexa UI context for warranty operations copilot",
    value: pageContext,
  });

  useConfigureSuggestions({
    suggestions: [...SUGGESTIONS],
    available: "always",
  });

  const { copilotkit } = useCopilotKit();
  const { agent } = useAgent({ agentId: SERVEXA_COPILOT_AGENT_ID });

  const onQuickPrompt = useCallback(
    (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (!detail?.trim()) return;
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `user-${Date.now()}`;
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
    [agent, copilotkit],
  );

  useEffect(() => {
    window.addEventListener(SERVEXA_COPILOT_QUICK_PROMPT_EVENT, onQuickPrompt);
    return () => {
      window.removeEventListener(SERVEXA_COPILOT_QUICK_PROMPT_EVENT, onQuickPrompt);
    };
  }, [onQuickPrompt]);

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
          <span className="truncate ps-1 text-sm font-semibold tracking-tight">Assistant AI</span>
        ) : (
          <span className="sr-only">Copilot collapsed</span>
        )}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => navigate({ to: '/ai/gemini' })}
            aria-controls="ai-copilot-panel-full-screen"
          >
            <ExternalLink className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
            aria-controls="ai-copilot-panel"
          >
            {collapsed ? <PanelRightOpen className="size-4" /> : <PanelRightClose className="size-4" />}
          </Button>
        </div>
      </div>

      {!collapsed ? (
        <div id="ai-copilot-panel" className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 px-1 pt-1">
            <CopilotChat agentId={SERVEXA_COPILOT_AGENT_ID} className="h-full min-h-[320px] rounded-lg border border-border/60" />
          </div>

          <Collapsible defaultOpen className="border-t border-border px-2 py-2">
            <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium hover:bg-muted">
              <BookOpen className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              Evidence and sources
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 pb-2 text-xs text-muted-foreground">
              Structured citations (manuals, cases, policies) will appear here when RAG is enabled on the
              gateway. The assistant already receives hybrid retrieval context server-side when configured.
            </CollapsibleContent>
          </Collapsible>
        </div>
      ) : null}
    </aside>
  );
}
