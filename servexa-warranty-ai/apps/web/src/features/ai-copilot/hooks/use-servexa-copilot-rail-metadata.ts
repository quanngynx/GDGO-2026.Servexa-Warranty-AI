import type { AbstractAgent } from "@ag-ui/client";
import { useAgent } from "@copilotkit/react-core/v2";
import { useCallback, useEffect, useState } from "react";

import type { CopilotRailMetadata } from "@servexa-warranty-ai/ai-contracts";

type SubscribeHandlers = {
  onRunStartedEvent?: (payload?: unknown) => void;
  onRunFinishedEvent?: (payload?: unknown) => void;
  onRunErrorEvent?: (payload?: unknown) => void;
  onStateSnapshotEvent?: (payload?: unknown) => void;
  onStateDeltaEvent?: (payload?: unknown) => void;
};

type SubscribableAgent = {
  state?: { servexaCopilot?: CopilotRailMetadata };
  isRunning?: boolean;
  subscribe?: (handlers: SubscribeHandlers) => { unsubscribe: () => void };
};

function readRailMeta(agent: SubscribableAgent): CopilotRailMetadata | undefined {
  return agent.state?.servexaCopilot;
}

function readRunErrorMessage(payload: unknown): string {
  if (payload && typeof payload === "object" && "message" in payload) {
    const m = (payload as { message?: unknown }).message;
    if (typeof m === "string" && m.trim()) return m.trim();
  }
  return "The assistant run failed. Try again.";
}

/** AG-UI rail hooks: metadata from gateway STATE_SNAPSHOT, running flag, and run errors. */
export function useServexaCopilotRail(agentId: string): {
  agent: AbstractAgent;
  railMeta: CopilotRailMetadata | undefined;
  isRunning: boolean;
  runError: string | null;
  clearRunError: () => void;
} {
  const { agent } = useAgent({ agentId });
  const a0 = agent as SubscribableAgent;
  const [railMeta, setRailMeta] = useState<CopilotRailMetadata | undefined>(() => readRailMeta(a0));
  const [isRunning, setIsRunning] = useState(() => a0.isRunning ?? false);
  const [runError, setRunError] = useState<string | null>(null);

  const clearRunError = useCallback(() => setRunError(null), []);

  useEffect(() => {
    const a = agent as SubscribableAgent;
    const bump = () => {
      setRailMeta(readRailMeta(a));
      setIsRunning(a.isRunning ?? false);
    };

    bump();

    if (!a.subscribe) {
      return;
    }

    const sub = a.subscribe({
      onRunStartedEvent: () => {
        setRunError(null);
        bump();
      },
      onRunFinishedEvent: bump,
      onRunErrorEvent: (payload) => {
        setRunError(readRunErrorMessage(payload));
        bump();
      },
      onStateSnapshotEvent: bump,
      onStateDeltaEvent: bump,
    });

    return () => sub.unsubscribe();
  }, [agent]);

  return { agent, railMeta, isRunning, runError, clearRunError };
}
