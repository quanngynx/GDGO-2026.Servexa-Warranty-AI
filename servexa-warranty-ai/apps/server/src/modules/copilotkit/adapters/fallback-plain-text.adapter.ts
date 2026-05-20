import { normalizeUnaryToCopilotResponse } from "@servexa-warranty-ai/ai-contracts";

/** When no structured metadata exists, still produce a valid CopilotResponse envelope. */
export function fallbackPlainCopilotResponse(
  text: string,
  backend: "grpc" | "gemini_node",
) {
  return normalizeUnaryToCopilotResponse({
    text,
    metadataJson: "{}",
    backend,
  });
}
