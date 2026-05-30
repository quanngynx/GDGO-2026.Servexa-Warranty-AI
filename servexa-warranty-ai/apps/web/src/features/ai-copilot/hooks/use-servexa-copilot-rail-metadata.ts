import type { AbstractAgent } from "@ag-ui/client";
import { useAgent } from "@copilotkit/react-core/v2";
import { useCallback, useEffect, useState } from "react";

import type {
  CopilotRailMetadata,
  ReasoningTrace,
  ReasoningTraceEvent,
} from "@servexa-warranty-ai/ai-contracts";

import { upsertTraceStep } from "@servexa-warranty-ai/ai-contracts";

import { reasoningTraceApi } from "@/libs/api/ai/reasoning-trace/api";

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

function initTraceFromLatest(event: ReasoningTraceEvent): ReasoningTrace {
  return {
    traceId: event.traceId,
    runId: event.runId,
    threadId: event.threadId,
    status: event.status,
    events: [event],
    startedAt: event.startedAt ?? event.endedAt ?? new Date().toISOString(),
    endedAt: event.endedAt,
  };
}

function mergeLatestIntoTrace(
  current: ReasoningTrace | undefined,
  latest: ReasoningTraceEvent,
): ReasoningTrace {
  if (!current || current.traceId !== latest.traceId) {
    return initTraceFromLatest(latest);
  }

  return {
    ...current,
    status: latest.status,
    runId: latest.runId ?? current.runId,
    threadId: latest.threadId ?? current.threadId,
    // Keep earliest startedAt; prefer latest endedAt if provided.
    startedAt:
      current.startedAt ?? latest.startedAt ?? new Date().toISOString(),
    endedAt: latest.endedAt ?? current.endedAt,
    events: upsertTraceStep(current.events, latest),
  };
}

export function readRunErrorMessage(payload: unknown): string {
  // FIX: TypeScript 4.9+ automatically understands that payload contains the "message" key after this condition.
  if (payload && typeof payload === "object" && "message" in payload) {
    
    // FIX: Narrow the type again: Ensure message is a string
    if (typeof payload.message === "string") {
      const m = payload.message.trim();
      if (m) return m;
    }
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

  const [reasoningTrace, setReasoningTrace] = useState<ReasoningTrace | undefined>(
    () => readRailMeta(a0)?.reasoningTrace,
  );
  const [latestReasoningEvent, setLatestReasoningEvent] = useState<ReasoningTraceEvent | undefined>(
    () => readRailMeta(a0)?.latestReasoningEvent,
  );

  const clearRunError = useCallback(() => setRunError(null), []);

  useEffect(() => {
    const a = agent as SubscribableAgent;
    const syncFromAgent = (opts: { clearOnMissingReasoning: boolean }) => {
      const meta = readRailMeta(a);
      setRailMeta(meta);
      setIsRunning(a.isRunning ?? false);

      const snapshotTrace = meta?.reasoningTrace;
      const latest = meta?.latestReasoningEvent;

      if (snapshotTrace) {
        setReasoningTrace(snapshotTrace);
        setLatestReasoningEvent(meta?.latestReasoningEvent);
        return;
      }

      if (latest) {
        setLatestReasoningEvent(latest);
        setReasoningTrace((curr) => mergeLatestIntoTrace(curr, latest));
        return;
      }

      if (opts.clearOnMissingReasoning) {
        setReasoningTrace(undefined);
        setLatestReasoningEvent(undefined);
      }
    };

    syncFromAgent({ clearOnMissingReasoning: false });

    if (!a.subscribe) {
      return;
    }

    const sub = a.subscribe({
      onRunStartedEvent: () => {
        setRunError(null);
        setReasoningTrace(undefined);
        setLatestReasoningEvent(undefined);
        syncFromAgent({ clearOnMissingReasoning: true });
      },
      onRunFinishedEvent: () => {
        syncFromAgent({ clearOnMissingReasoning: false });
        const traceId = readRailMeta(a)?.reasoningTrace?.traceId;
        if (traceId) {
          void reasoningTraceApi
            .getTrace(traceId)
            .then((persisted) => {
              if (persisted.events.length > 0) {
                setReasoningTrace(persisted);
                setLatestReasoningEvent(
                  persisted.events[persisted.events.length - 1],
                );
              }
            })
            .catch(() => undefined);
        }
      },
      onRunErrorEvent: (payload) => {
        setRunError(readRunErrorMessage(payload));
        syncFromAgent({ clearOnMissingReasoning: false });
      },
      onStateSnapshotEvent: () => syncFromAgent({ clearOnMissingReasoning: true }),
      onStateDeltaEvent: () => syncFromAgent({ clearOnMissingReasoning: false }),
    });

    return () => sub.unsubscribe();
  }, [agent]);

  useEffect(() => {
    if (isRunning) return;
    const traceId = railMeta?.reasoningTrace?.traceId;
    if (!traceId) return;
    if (reasoningTrace && reasoningTrace.events.length > 0) return;

    void reasoningTraceApi
      .getTrace(traceId)
      .then((persisted) => {
        if (persisted.events.length > 0) {
          setReasoningTrace(persisted);
          setLatestReasoningEvent(persisted.events[persisted.events.length - 1]);
        }
      })
      .catch(() => undefined);
  }, [isRunning, railMeta?.reasoningTrace?.traceId, reasoningTrace]);

  useEffect(() => {
    setRailMeta((curr) => {
      if (!curr) return curr;
      return {
        ...curr,
        reasoningTrace,
        latestReasoningEvent,
      };
    });
  }, [reasoningTrace, latestReasoningEvent]);

  return { agent, railMeta, isRunning, runError, clearRunError };
}
