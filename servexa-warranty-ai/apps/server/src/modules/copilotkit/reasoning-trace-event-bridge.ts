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
