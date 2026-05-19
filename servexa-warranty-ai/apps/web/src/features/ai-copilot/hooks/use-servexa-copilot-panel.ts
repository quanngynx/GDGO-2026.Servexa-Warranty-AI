import type { AbstractAgent } from "@ag-ui/client";
import type { HitlRequest } from "@servexa-warranty-ai/ai-contracts";
import {
  useAgentContext,
  useConfigureSuggestions,
  useCopilotKit,
} from "@copilotkit/react-core/v2";
import { useCallback, useEffect, useState } from "react";

import type { CreateHitlRequestInput } from "@/libs/api/ai/hitl/api";

import { OPERATIONAL_QUICK_PROMPTS } from "../components/quick-prompt-grid";
import { SERVEXA_COPILOT_AGENT_ID, SERVEXA_COPILOT_QUICK_PROMPT_EVENT } from "../constants";
import { getLastUserMessageText } from "../lib/agent-message-text";
import { useHitlDecision } from "./use-hitl-decision";
import { useHitlPendingCount } from "./use-hitl-pending-count";
import { useHitlRequests } from "./use-hitl-requests";
import { useOperationalPageContext, type OperationalPageContext } from "./use-operational-context";
import { useServexaCopilotRail } from "./use-servexa-copilot-rail-metadata";

export function useServexaCopilotPanel(agentId = SERVEXA_COPILOT_AGENT_ID) {
  const [lastDecision, setLastDecision] = useState<HitlRequest | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);

  const operational = useOperationalPageContext();
  const { agent, railMeta, isRunning, runError, clearRunError } =
    useServexaCopilotRail(agentId);

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
  const hitl = useHitlRequests();
  const hitlDecision = useHitlDecision();
  const { count: pendingCount } = useHitlPendingCount();

  const pendingApprovals = [
    ...(railMeta?.pendingApprovals ?? []),
    ...hitl.pending.filter(
      (p) => !railMeta?.pendingApprovals?.some((r) => r.id === p.id),
    ),
  ];

  useAgentContext({
    description: "Latest HITL decision result for copilot continuation",
    value: lastDecision
      ? {
          hitlRequestId: lastDecision.id,
          kind: lastDecision.kind,
          status: lastDecision.status,
          payloadSummary: JSON.stringify(lastDecision.payload),
        }
      : { hitlRequestId: "", kind: "", status: "", payloadSummary: "{}" },
  });

  const runContinuation = useCallback(
    (message: string) => {
      clearRunError();
      setChatError(null);
      agent.addMessage({ id: crypto.randomUUID(), role: "user", content: message });
      void (async () => {
        await copilotkit.waitForPendingFrameworkUpdates();
        await copilotkit.runAgent({ agent });
      })();
    },
    [agent, clearRunError, copilotkit],
  );

  const onQuickPrompt = useCallback(
    (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (!detail?.trim()) return;
      clearRunError();
      setChatError(null);
      agent.addMessage({
        id: crypto.randomUUID(),
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
      window.removeEventListener(SERVEXA_COPILOT_QUICK_PROMPT_EVENT, onQuickPrompt);
    };
  }, [onQuickPrompt]);

  const combinedError = runError ?? chatError;
  const lastUserText = getLastUserMessageText(agent);

  const handleHitlDecisionComplete = useCallback(
    async (updated: HitlRequest | null, rejectReason?: string) => {
      if (!updated) return;
      setLastDecision(updated);
      void hitl.refresh();

      const caseRef =
        (updated.payload.caseNumber as string | undefined) ??
        updated.repairCaseId ??
        "the case";

      if (updated.status === "rejected") {
        const reason = rejectReason?.trim() || "no reason given";
        runContinuation(
          `The user rejected ${updated.kind} for ${caseRef}. Reason: ${reason}. Acknowledge the rejection and suggest an alternative operational step.`,
        );
        return;
      }

      if (updated.status === "executed" || updated.status === "failed") {
        const verb =
          updated.status === "executed"
            ? "approved and executed"
            : "approved but execution failed for";

        if (updated.langGraphThreadId) {
          const resumed = await hitlDecision.resumeGraph(updated.id);
          if (resumed?.agentOutput) {
            runContinuation(resumed.agentOutput);
            return;
          }
        }

        runContinuation(
          `The user ${verb} ${updated.kind} for ${caseRef}. Summarize what happened and suggest the next operational step.`,
        );
      }
    },
    [hitl, hitlDecision, runContinuation],
  );

  const handleApprove = useCallback(
    async (requestId: string) => {
      const updated = await hitlDecision.approve(requestId);
      if (updated) {
        await handleHitlDecisionComplete(updated);
      }
    },
    [hitlDecision, handleHitlDecisionComplete],
  );

  const handleReject = useCallback(
    async (requestId: string, reason?: string) => {
      const updated = await hitlDecision.reject(requestId, reason);
      if (updated) {
        await handleHitlDecisionComplete(updated, reason);
      }
    },
    [hitlDecision, handleHitlDecisionComplete],
  );

  const handleEdit = useCallback(
    async (
      requestId: string,
      editedPayload: Record<string, unknown>,
      reason?: string,
    ) => {
      const approved = await hitlDecision.editAndApprove(requestId, editedPayload, reason);
      if (approved) {
        await handleHitlDecisionComplete(approved);
      }
    },
    [hitlDecision, handleHitlDecisionComplete],
  );

  const handleRetryLast = useCallback(async () => {
    clearRunError();
    setChatError(null);
    if (!lastUserText.trim()) return;
    void (async () => {
      await copilotkit.waitForPendingFrameworkUpdates();
      await copilotkit.runAgent({ agent });
    })();
  }, [agent, clearRunError, copilotkit, lastUserText]);

  const handleCreateWorkflowRequest = useCallback(
    (input: CreateHitlRequestInput) => {
      void hitl.createRequest(input);
    },
    [hitl],
  );

  const setChatErrorMessage = useCallback((msg: string) => {
    setChatError(msg);
  }, []);

  return {
    agentId,
    agent: agent as AbstractAgent,
    operational,
    railMeta,
    isRunning,
    combinedError,
    pendingCount,
    pendingApprovals,
    hitl,
    hitlDecision,
    handleApprove,
    handleReject,
    handleEdit,
    handleRetryLast,
    handleCreateWorkflowRequest,
    setChatErrorMessage,
  };
}

export type ServexaCopilotPanel = ReturnType<typeof useServexaCopilotPanel>;
export type { OperationalPageContext };
