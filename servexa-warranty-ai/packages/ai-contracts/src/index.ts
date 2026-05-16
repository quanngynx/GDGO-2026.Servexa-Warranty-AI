export {
  copilotEvidenceSourceSchema,
  copilotEvidenceSourceTypeSchema,
  copilotRailMetadataSchema,
  copilotRelatedEntitySchema,
  copilotResponseSchema,
  copilotSuggestedActionSchema,
  type CopilotEvidenceSource,
  type CopilotEvidenceSourceType,
  type CopilotRailMetadata,
  type CopilotRelatedEntity,
  type CopilotResponse,
  type CopilotSuggestedAction,
} from "./copilot-response";
export {
  COPILOT_METADATA_SENTINEL,
  splitCopilotMetadataTrailer,
  type CopilotMetadataTrailerParse,
} from "./metadata-trailer";
export {
  normalizeUnaryToCopilotResponse,
  parseMetadataJson,
  type UnaryCompletionLike,
  toRailMetadata,
} from "./normalize-unary";
