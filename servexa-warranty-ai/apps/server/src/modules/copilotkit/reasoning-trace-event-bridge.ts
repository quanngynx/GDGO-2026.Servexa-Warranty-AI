import { logger } from "@/core/logging";
import type { ReasoningTrace, ReasoningTraceStreamEvent } from "@servexa-warranty-ai/ai-contracts";
import { reasoningTraceStreamEventSchema } from "@servexa-warranty-ai/event-contracts";
import { IoredisService } from "@servexa-warranty-ai/db";

import {
  reasoningTraceService,
  type ReasoningTraceRailPatch,
} from "@/modules/copilotkit/reasoning-trace-normalizer";

const TERMINAL_EVENTS = new Set([
  "reasoning.trace.completed",
  "reasoning.trace.failed",
]);

export function traceStreamKey(traceId: string): string {
  return `ai:trace:${traceId}`;
}

export type ReasoningTraceBridgeOptions = {
  traceId: string;
  runId: string;
  threadId: string;
  userId: string;
  repairCaseId?: string;
  signal?: AbortSignal;
  onUpdate: (patch: ReasoningTraceRailPatch) => void;
  blockMs?: number;
};

/**
 * Consumes Redis trace stream events during an active Copilot run.
 * Persists each event and invokes `onUpdate` for AG-UI STATE_DELTA emission.
 */
export class ReasoningTraceEventBridge {
  constructor(private readonly redis = new IoredisService()) {}

  async consume(options: ReasoningTraceBridgeOptions): Promise<{
    hadEvents: boolean;
    finalTrace?: ReasoningTrace;
  }> {
    await this.redis.connect();

    let lastId = "0";
    let current: ReasoningTrace | undefined;
    let hadEvents = false;
    const streamKey = traceStreamKey(options.traceId);
    const blockMs = options.blockMs ?? 1000;

    while (!options.signal?.aborted) {
      let batch: Array<{ id: string; payload: string }> = [];
      try {
        batch = await this.redis.xreadTracePayloads({
          streamKey,
          lastId,
          blockMs,
        });
      } catch (err) {
        // #region agent log
        fetch('http://127.0.0.1:7595/ingest/4bd003ec-1377-45f5-9e8e-e8c67f18f88c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'596e87'},body:JSON.stringify({sessionId:'596e87',runId:'initial',hypothesisId:'H4',location:'reasoning-trace-event-bridge.ts:51',message:'xread_exception',data:{traceId:options.traceId,lastId,blockMs,error:err instanceof Error?err.message:String(err)},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        throw err;
      }

      if (options.signal?.aborted) break;

      if (batch.length === 0) {
        continue;
      }

      for (const item of batch) {
        lastId = item.id;
        let streamEvent: ReasoningTraceStreamEvent;
        try {
          const parsed = JSON.parse(item.payload) as unknown;
          streamEvent = reasoningTraceStreamEventSchema.parse(parsed);
        } catch (err) {
          // #region agent log
          fetch('http://127.0.0.1:7595/ingest/4bd003ec-1377-45f5-9e8e-e8c67f18f88c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'596e87'},body:JSON.stringify({sessionId:'596e87',runId:'initial',hypothesisId:'H3',location:'reasoning-trace-event-bridge.ts:69',message:'invalid_stream_payload',data:{traceId:options.traceId,payloadSnippet:item.payload.slice(0,220),error:err instanceof Error?err.message:String(err)},timestamp:Date.now()})}).catch(()=>{});
          // #endregion
          logger.warn("[reasoning-trace-bridge] invalid stream payload", {
            traceId: options.traceId,
            error: err instanceof Error ? err.message : String(err),
          });
          continue;
        }

        hadEvents = true;
        const result = await reasoningTraceService.applyStreamEventForUserId({
          userId: options.userId,
          traceId: options.traceId,
          streamEvent,
          repairCaseId: options.repairCaseId,
          current,
        });

        current = result.reasoningTrace;
        options.onUpdate({
          reasoningTrace: result.reasoningTrace,
          latestReasoningEvent: result.latestReasoningEvent,
        });

        if (TERMINAL_EVENTS.has(streamEvent.event)) {
          return { hadEvents, finalTrace: current };
        }
      }
    }

    return { hadEvents, finalTrace: current };
  }
}
