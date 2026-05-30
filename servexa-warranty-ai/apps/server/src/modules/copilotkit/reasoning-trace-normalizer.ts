import {
  parseReasoningTraceFromMetadata,
  type CopilotRailMetadata,
} from "@servexa-warranty-ai/ai-contracts";

import { ReasoningTraceService } from "src/modules/v1/ai/services/reasoning-trace.service";

const traceService = new ReasoningTraceService();

export type ReasoningTraceRailPatch = Pick<
  CopilotRailMetadata,
  "reasoningTrace" | "latestReasoningEvent"
>;

/**
 * Merge snapshot reasoning trace from unary metadata into rail fields and persist when present.
 */
export async function mergeAndPersistSnapshotTrace(input: {
  userId: string;
  metadataJson: string;
  repairCaseId?: string;
  hadLiveStreamEvents: boolean;
}): Promise<ReasoningTraceRailPatch> {
  let meta: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(input.metadataJson) as unknown;
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      meta = parsed as Record<string, unknown>;
    }
  } catch {
    meta = {};
  }

  const { reasoningTrace, latestReasoningEvent } = parseReasoningTraceFromMetadata(meta);
  if (!reasoningTrace) {
    return {};
  }

  if (!input.hadLiveStreamEvents) {
    await traceService.persistSnapshotForUserId({
      userId: input.userId,
      trace: reasoningTrace,
      repairCaseId: input.repairCaseId,
    });
  } else if (reasoningTrace.status === "completed") {
    await traceService.markTraceCompleted({ traceId: reasoningTrace.traceId });
  } else if (reasoningTrace.status === "failed") {
    await traceService.markTraceFailed({ traceId: reasoningTrace.traceId });
  }

  return { reasoningTrace, latestReasoningEvent };
}

export { traceService as reasoningTraceService };
