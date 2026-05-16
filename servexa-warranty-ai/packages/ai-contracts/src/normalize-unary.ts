import { z } from "zod";

import {
  copilotRailMetadataSchema,
  copilotResponseSchema,
  type CopilotRailMetadata,
  type CopilotResponse,
  type CopilotSuggestedAction,
} from "./copilot-response";

export type UnaryCompletionLike = {
  text: string;
  metadataJson: string;
  backend: "grpc" | "gemini_node";
};

export function parseMetadataJson(raw: string): Record<string, unknown> {
  try {
    const v = JSON.parse(raw) as unknown;
    return typeof v === "object" && v !== null && !Array.isArray(v)
      ? (v as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function heuristicSuggestedActions(meta: Record<string, unknown>): CopilotSuggestedAction[] {
  const actions: CopilotSuggestedAction[] = [];
  const route = String(meta.route ?? "").trim();

  if (route === "supply_chain") {
    actions.push({
      id: "sc-risk",
      label: "Detect supply chain risk",
      action: "prompt:Detect supply chain risk for parts on this case.",
    });
  }
  if (route === "operations") {
    actions.push({
      id: "ops-next",
      label: "Suggest next operational action",
      action: "prompt:Suggest the next operational action for this case.",
    });
  }

  const toolsRaw = meta.toolResults ?? meta.tool_results;
  if (toolsRaw && typeof toolsRaw === "object" && !Array.isArray(toolsRaw)) {
    const keys = Object.keys(toolsRaw as object);
    if (keys.length > 0) {
      // Fix: Only get summary of data instead of dumping everything (e.g. truncate at 500 characters)
      const rawString = JSON.stringify(toolsRaw);
      const safeString = rawString.length > 500 
        ? rawString.slice(0, 500) + "... [truncated]" 
        : rawString;
      actions.push({
        id: "workflow-signals",
        label: "Explain workflow signals",
        action: `prompt:Explain these workflow results in plain language: ${safeString}`,
      });
    }
  }

  return actions;
}

function mergeSuggested(
  fromEnvelope: CopilotSuggestedAction[] | undefined,
  heuristic: CopilotSuggestedAction[],
): CopilotSuggestedAction[] | undefined {
  const map = new Map<string, CopilotSuggestedAction>();
  for (const a of heuristic) {
    map.set(a.id, a);
  }
  for (const a of fromEnvelope ?? []) {
    map.set(a.id, a);
  }
  const merged = [...map.values()];
  return merged.length ? merged : undefined;
}

/** Normalize grpc/Gemini unary output into the canonical copilot response. */
export function normalizeUnaryToCopilotResponse(input: UnaryCompletionLike): CopilotResponse {
  const meta = parseMetadataJson(input.metadataJson);

  const embedded = meta.copilot ?? meta.copilotResponse;
  if (embedded && typeof embedded === "object") {
    const parsed = copilotResponseSchema.safeParse(embedded);
    if (parsed.success) {
      return {
        ...parsed.data,
        suggestedActions: mergeSuggested(
          parsed.data.suggestedActions,
          heuristicSuggestedActions(meta),
        ),
      };
    }
  }

  const answer = input.text.trim();
  const heuristicActions = heuristicSuggestedActions(meta);

  return {
    answer: answer.length ? answer : " ",
    confidence: typeof meta.confidence === "number" ? meta.confidence : undefined,
    sources: undefined,
    suggestedActions: heuristicActions.length ? heuristicActions : undefined,
    relatedEntities: undefined,
  };
}

export function toRailMetadata(
  response: CopilotResponse,
  backend: "grpc" | "gemini_node",
): CopilotRailMetadata {
  const raw = {
    confidence: response.confidence,
    sources: response.sources,
    suggestedActions: response.suggestedActions,
    relatedEntities: response.relatedEntities,
    backend,
  };
  const parsed = copilotRailMetadataSchema.safeParse(raw);

  if (!parsed.success) {
    // Log error to help devs identify schema or LLM issues
    console.warn(
      "[BFF Warning] toRailMetadata schema parsing failed:",
      z.treeifyError(parsed.error),
    );
    return { backend };
  }

  return parsed.data;
}
