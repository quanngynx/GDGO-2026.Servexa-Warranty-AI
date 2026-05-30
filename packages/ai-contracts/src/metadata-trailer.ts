/**
 * Fallback transport if AG-UI state sync is unavailable: append after assistant answer,
 * then strip client-side before render. Prefer STATE_SNAPSHOT `servexaCopilot` on the agent.
 */
export const COPILOT_METADATA_SENTINEL = "\n\n<<<SERVEXA_COPILOT_METADATA>>>\n";

export type CopilotMetadataTrailerParse = {
  displayText: string;
  /** Parsed JSON payload matching `CopilotRailMetadata` shape when valid. */
  metadataJson: string | null;
};

export function splitCopilotMetadataTrailer(fullText: string): CopilotMetadataTrailerParse {
  const idx = fullText.indexOf(COPILOT_METADATA_SENTINEL);
  if (idx === -1) {
    return { displayText: fullText, metadataJson: null };
  }
  return {
    displayText: fullText.slice(0, idx).trimEnd(),
    metadataJson: fullText.slice(idx + COPILOT_METADATA_SENTINEL.length).trim() || null,
  };
}
