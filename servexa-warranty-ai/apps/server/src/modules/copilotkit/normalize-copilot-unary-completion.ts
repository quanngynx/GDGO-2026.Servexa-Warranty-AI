import type { AiUnaryCompletionResult } from "@/modules/v1/ai/runtime/ai-completion-runtime";
import {
  normalizeUnaryToCopilotResponse,
  type CopilotRailMetadata,
  type CopilotResponse,
  toRailMetadata,
} from "@servexa-warranty-ai/ai-contracts";

export type NormalizedCopilotTurn = {
  response: CopilotResponse;
  rail: CopilotRailMetadata;
};

export function normalizeCopilotUnaryCompletion(out: AiUnaryCompletionResult): NormalizedCopilotTurn {
  const response = normalizeUnaryToCopilotResponse({
    text: out.text,
    metadataJson: out.metadataJson,
    backend: out.backend,
  });
  return {
    response,
    rail: toRailMetadata(response, out.backend),
  };
}
