import type { AiUnaryCompletionResult } from "@/modules/v1/ai/runtime/ai-completion-runtime";
import {
  normalizeLangGraphHitlMetadata,
  normalizeUnaryToCopilotResponse,
  parseMetadataJson,
  parseReasoningTraceFromMetadata,
  parsePhase3FromCopilotEnvelope,
  type CopilotRailMetadata,
  type CopilotResponse,
  toRailMetadata,
} from "@servexa-warranty-ai/ai-contracts";

export type NormalizedCopilotTurn = {
  response: CopilotResponse;
  rail: CopilotRailMetadata;
};

export function normalizeCopilotUnaryCompletion(
  out: AiUnaryCompletionResult,
  extras?: Parameters<typeof toRailMetadata>[2],
): NormalizedCopilotTurn {
  const response = normalizeUnaryToCopilotResponse({
    text: out.text,
    metadataJson: out.metadataJson,
    backend: out.backend,
  });

  const meta = parseMetadataJson(out.metadataJson);
  const graph = normalizeLangGraphHitlMetadata(meta);
  const reasoningTrace = parseReasoningTraceFromMetadata(meta);
  const workflowStatus = graph.success && graph.data.humanApprovalRequired
    ? ("awaiting_approval" as const)
    : extras?.workflowExecutionStatus;

  const embedded = meta.copilot ?? meta.copilotResponse;
  const phase3FromEnvelope =
    embedded && typeof embedded === "object"
      ? parsePhase3FromCopilotEnvelope(embedded as Record<string, unknown>)
      : undefined;

  return {
    response,
    rail: toRailMetadata(response, out.backend, {
      ...extras,
      workflowExecutionStatus: workflowStatus ?? extras?.workflowExecutionStatus,
      phase3FromEnvelope,
      executionContext: extras?.executionContext,
      reasoningTrace: reasoningTrace.reasoningTrace,
      latestReasoningEvent: reasoningTrace.latestReasoningEvent,
    }),
  };
}
