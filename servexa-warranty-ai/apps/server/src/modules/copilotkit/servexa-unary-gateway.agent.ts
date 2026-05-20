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
import { chunkTextForDeltas } from "src/utils/chunk-text-for-deltas";
import { lastUserPrompt } from "src/utils/last-user-prompt";
import { executionContextJson } from "src/utils/execution-context-json";

export const SERVEXA_COPILOT_AGENT_ID = "operations_intelligence";

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

  run(input: RunAgentInput): any {
    return new Observable<BaseEvent>((subscriber) => {
      void (async () => {
        const runId = input.runId ?? randomUUID();
        const threadId = input.threadId ?? "default";
        const messageId = randomUUID();

        subscriber.next({
          type: "RUN_STARTED",
          threadId,
          runId,
        } as BaseEvent);

        try {
          const prompt = lastUserPrompt(input.messages);
          const execJson = executionContextJson(input);
          const copilotUser = getCopilotRequestUser();

          const out = await completeUnaryPrompt({
            prompt,
            traceId: runId,
            userId: copilotUser?.id ?? "copilot-user",
            tenantId: "",
            role: copilotUser?.role ?? "",
            contextJson: JSON.stringify({
              source: "post:/api/copilotkit",
              agentId: SERVEXA_COPILOT_AGENT_ID,
            }),
            executionContextJson: execJson,
          });

          await ensureHitlFromInterruptMetadata(out.metadataJson);
          const pendingApprovals = await loadPendingApprovalsForGateway();
          const { response, rail } = normalizeCopilotUnaryCompletion(out, {
            pendingApprovals,
          });

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
              servexaCopilot: rail,
            },
          } as BaseEvent);

          subscriber.next({
            type: "RUN_FINISHED",
            threadId,
            runId,
          } as BaseEvent);
          subscriber.complete();
        } catch (err) {
          subscriber.next({
            type: "RUN_ERROR",
            threadId,
            runId,
            message: err instanceof Error ? err.message : String(err),
          } as BaseEvent);
          subscriber.complete();
        }
      })();
    });
  }
}
