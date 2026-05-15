import { useRouterState } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";

import type { PageContext } from "@/features/ai/types";

import { SERVEXA_COPILOT_QUICK_PROMPT_EVENT } from "@/features/ai-copilot/constants";

const SUGGESTED_QUERIES = [
  "Summarize this repair case",
  "Find similar failures",
  "Explain warranty eligibility",
  "Search technical manuals",
  "Detect supply chain risk",
  "Suggest next operational action",
] as const;

function inferPageContext(pathname: string): PageContext {
  if (pathname.includes("repair")) {
    return { type: "repair_case", additionalContext: { pathname } };
  }
  if (pathname.includes("product") || pathname.includes("inventory")) {
    return { type: "inventory", additionalContext: { pathname } };
  }
  if (pathname.includes("customer")) {
    return { type: "customer", additionalContext: { pathname } };
  }
  if (pathname.includes("report")) {
    return { type: "report", additionalContext: { pathname } };
  }
  if (pathname.includes("setting")) {
    return { type: "settings", additionalContext: { pathname } };
  }
  return { type: "dashboard", additionalContext: { pathname } };
}

export function useCopilot() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const pageContext = useMemo(() => inferPageContext(pathname), [pathname]);

  const send = useCallback((message: string) => {
    window.dispatchEvent(new CustomEvent(SERVEXA_COPILOT_QUICK_PROMPT_EVENT, { detail: message }));
  }, []);

  return {
    pageContext,
    suggestedQueries: [...SUGGESTED_QUERIES],
    send,
  };
}
