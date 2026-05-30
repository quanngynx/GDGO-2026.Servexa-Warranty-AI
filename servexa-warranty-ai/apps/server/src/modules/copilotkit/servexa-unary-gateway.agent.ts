import { AbstractAgent, type BaseEvent, type RunAgentInput } from "@ag-ui/client";
import { randomUUID } from "node:crypto";
import { Observable } from "rxjs";

import { getCopilotRequestUser } from "@/modules/copilotkit/copilot-request-context";
import { completeUnaryPrompt } from "@/modules/v1/ai/runtime/ai-completion-runtime";
import {
  ensureHitlFromInterruptMetadata,
  loadPendingApprovalsForGateway,
} from "@/modules/copilotkit/hitl-gateway.helpers";
import { normalizeCopilotUnaryCompletion } from "@/modules/copilotkit/normalize-copilot-unary-completion";
import { ReasoningTraceEventBridge } from "@/modules/copilotkit/reasoning-trace-event-bridge";
import { mergeAndPersistSnapshotTrace } from "@/modules/copilotkit/reasoning-trace-normalizer";
import { chunkTextForDeltas } from "src/utils/chunk-text-for-deltas";
import { lastUserPrompt } from "src/utils/last-user-prompt";
import { executionContextJson } from "src/utils/execution-context-json";
import { flattenCopilotContext } from "src/utils/flatten-copilot-context";

export const SERVEXA_COPILOT_AGENT_ID = "operations_intelligence";

function hasUndefinedDeep(value: unknown): boolean {
  if (value === undefined) return true;
  if (Array.isArray(value)) return value.some((v) => hasUndefinedDeep(v));
  if (value && typeof value === "object") {
    for (const v of Object.values(value as Record<string, unknown>)) {
      if (hasUndefinedDeep(v)) return true;
    }
  }
  return false;
}

function reasoningTraceStateDelta(patch: {
  reasoningTrace?: unknown;
  latestReasoningEvent?: unknown;
}): BaseEvent | null {
  const delta: Array<{ op: string; path: string; value: unknown }> = [];

  if (patch.reasoningTrace !== undefined) {
    delta.push({
      op: "replace",
      path: "/servexaCopilot/reasoningTrace",
      value: patch.reasoningTrace,
    });
  }

  if (patch.latestReasoningEvent !== undefined) {
    delta.push({
      op: "replace",
      path: "/servexaCopilot/latestReasoningEvent",
      value: patch.latestReasoningEvent,
    });
  }

  if (delta.length === 0) return null;

  return {
    type: "STATE_DELTA",
    delta,
  } as BaseEvent;
}

/**
 * AG-UI agent that delegates turns to {@link completeUnaryPrompt} (gRPC Python or Node Gemini fallback).
 */
export class ServexaUnaryGatewayAgent extends AbstractAgent {
  constructor() {
    super({
      agentId: SERVEXA_COPILOT_AGENT_ID,
      description: "Servexa warranty operations copilot (unary completion gateway)",
    });
  }

  run(input: RunAgentInput): Observable<BaseEvent> {
    return new Observable<BaseEvent>((subscriber) => {
      void (async () => {
        const runId = input.runId ?? randomUUID();
        const threadId = input.threadId ?? "default";
        const messageId = randomUUID();
        const abort = new AbortController();

        subscriber.next({
          type: "RUN_STARTED",
          threadId,
          runId,
        } as BaseEvent);

        let bridgePromise:
          | ReturnType<ReasoningTraceEventBridge["consume"]>
          | undefined;

        try {
          const prompt = lastUserPrompt(input.messages);
          const execJson = executionContextJson(input);
          const executionContext = flattenCopilotContext(
            input.context ?? input.forwardedProps,
          );
          const copilotUser = getCopilotRequestUser();
          const userId = copilotUser?.id ?? "copilot-user";
          const repairCaseId =
            typeof executionContext.repairCaseId === "string"
              ? executionContext.repairCaseId
              : undefined;

          const bridge = new ReasoningTraceEventBridge();
          bridgePromise = bridge.consume({
            traceId: runId,
            runId,
            threadId,
            userId,
            repairCaseId,
            signal: abort.signal,
            onUpdate: (patch) => {
              const evt = reasoningTraceStateDelta(patch);
              if (evt) subscriber.next(evt);
            },
          });

          const out = await completeUnaryPrompt({
            prompt,
            traceId: runId,
            userId,
            tenantId: "",
            role: copilotUser?.role ?? "",
            contextJson: JSON.stringify({
              source: "post:/api/copilotkit",
              agentId: SERVEXA_COPILOT_AGENT_ID,
            }),
            executionContextJson: execJson,
          });

          abort.abort();
          const bridgeResult = await bridgePromise;

          await ensureHitlFromInterruptMetadata(out.metadataJson);
          const pendingApprovals = await loadPendingApprovalsForGateway();
          const { response, rail } = normalizeCopilotUnaryCompletion(out, {
            pendingApprovals,
            executionContext,
          });

          const snapshotPatch = await mergeAndPersistSnapshotTrace({
            userId,
            metadataJson: out.metadataJson,
            repairCaseId,
            hadLiveStreamEvents: bridgeResult.hadEvents,
          });

          const finalRail = {
            ...rail,
            ...snapshotPatch,
            reasoningTrace:
              snapshotPatch.reasoningTrace ??
              bridgeResult.finalTrace ??
              rail.reasoningTrace,
            latestReasoningEvent:
              snapshotPatch.latestReasoningEvent ?? rail.latestReasoningEvent,
          };

          subscriber.next({
            type: "TEXT_MESSAGE_START",
            messageId,
            role: "assistant",
          } as BaseEvent);

          for (const delta of chunkTextForDeltas(response.answer)) {
            const piece = delta.length ? delta : " ";
            subscriber.next({
              type: "TEXT_MESSAGE_CONTENT",
              messageId,
              delta: piece,
            } as BaseEvent);
          }

          subscriber.next({
            type: "TEXT_MESSAGE_END",
            messageId,
          } as BaseEvent);

          subscriber.next({
            type: "STATE_SNAPSHOT",
            snapshot: {
              servexaCopilot: finalRail,
            },
          } as BaseEvent);

          subscriber.next({
            type: "RUN_FINISHED",
            threadId,
            runId,
          } as BaseEvent);
          subscriber.complete();
        } catch (err) {
          abort.abort();
          void bridgePromise?.catch(() => undefined);
          const message = err instanceof Error ? err.message : String(err);
          subscriber.next({
            type: "RUN_ERROR",
            threadId,
            runId,
            message,
          } as BaseEvent);
          subscriber.complete();
        }
      })();
    });
  }
}
