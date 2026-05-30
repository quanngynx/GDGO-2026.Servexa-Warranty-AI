import { z } from "zod";

import {
  hitlGraphInterruptMetadataSchema,
  type HitlRequest,
} from "./hitl";

import {
  reasoningTraceEventSchema,
  reasoningTraceSchema,
  type ReasoningTrace,
  type ReasoningTraceEvent,
} from "./reasoning-trace";

import {
  mergePhase3RailFields,
  parseDiagnosisDraft,
  parseSelectedCaseSummaryFromExecutionContext,
  parseWarrantyEligibility,
} from "./copilot-shared-state";

import {
  copilotRailMetadataSchema,
  copilotResponseSchema,
  copilotSuggestedActionSchema,
  selectedCaseSummarySchema,
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

/**
 * Extract snapshot reasoning trace (non-realtime fallback) from unary metadataJson.
 * Expected shapes:
 * - `metadataJson.reasoningTrace`
 * - `metadataJson.latestReasoningEvent`
 */
export function parseReasoningTraceFromMetadata(meta: Record<string, unknown>): {
  reasoningTrace?: ReasoningTrace;
  latestReasoningEvent?: ReasoningTraceEvent;
} {
  const traceRaw =
    meta.reasoningTrace ??
    meta.reasoning_trace ??
    (typeof meta.servexaCopilot === "object" && meta.servexaCopilot !== null
      ? (meta.servexaCopilot as Record<string, unknown>).reasoningTrace
      : undefined);

  const traceParsed = reasoningTraceSchema.safeParse(traceRaw);
  const reasoningTrace = traceParsed.success ? traceParsed.data : undefined;

  const latestRaw =
    meta.latestReasoningEvent ??
    meta.latest_reasoning_event ??
    (typeof meta.servexaCopilot === "object" && meta.servexaCopilot !== null
      ? (meta.servexaCopilot as Record<string, unknown>).latestReasoningEvent
      : undefined);

  const latestParsed = reasoningTraceEventSchema.safeParse(latestRaw);
  let latestReasoningEvent = latestParsed.success ? latestParsed.data : undefined;

  if (!latestReasoningEvent && reasoningTrace?.events?.length) {
    // Find "latest" by comparing timestamps, without relying on reduce initial values.
    const events = reasoningTrace.events;
    let best = events[0]!;
    const getRank = (e: ReasoningTraceEvent) =>
      String(e.endedAt ?? e.startedAt ?? "");

    for (let i = 1; i < events.length; i++) {
      const cur = events[i]!;
      if (getRank(cur).localeCompare(getRank(best)) > 0) {
        best = cur;
      }
    }

    latestReasoningEvent = best;
  }

  return { reasoningTrace, latestReasoningEvent };
}

function heuristicSuggestedActions(meta: Record<string, unknown>): CopilotSuggestedAction[] {
  const actions: CopilotSuggestedAction[] = [];
  const route = String(meta.route ?? "").trim();

  if (route === "supply_chain") {
    actions.push({
      id: "sc-risk",
      label: "Detect supply chain risk",
      action: "prompt:Detect supply chain risk for parts on this case.",
      kind: "prompt",
      requiresApproval: false,
    });
  }
  if (route === "operations") {
    actions.push({
      id: "ops-next",
      label: "Suggest next operational action",
      action: "prompt:Suggest the next operational action for this case.",
      kind: "prompt",
      requiresApproval: false,
    });
    actions.push({
      id: "ops-escalate",
      label: "Escalate repair case",
      action: "workflow:repair_escalation",
      kind: "workflow",
      workflowKind: "repair_escalation",
      requiresApproval: true,
      payload: {} as Record<string, unknown>,
    });
    actions.push({
      id: "ops-assign-tech",
      label: "Assign technician",
      action: "workflow:technician_assignment",
      kind: "workflow",
      workflowKind: "technician_assignment",
      requiresApproval: true,
      payload: {},
    });
    actions.push({
      id: "ops-customer-draft",
      label: "Draft customer response",
      action: "workflow:customer_response_draft",
      kind: "workflow",
      workflowKind: "customer_response_draft",
      requiresApproval: true,
      payload: {},
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
        kind: "prompt",
        requiresApproval: false,
      });
    }
  }

  return actions;
}

function normalizeSuggestedAction(raw: unknown): CopilotSuggestedAction | null {
  const parsed = copilotSuggestedActionSchema.safeParse(raw);
  if (parsed.success) return parsed.data;
  if (raw && typeof raw === "object" && "id" in raw && "label" in raw && "action" in raw) {
    const o = raw as Record<string, unknown>;
    return {
      id: String(o.id),
      label: String(o.label),
      action: String(o.action),
      kind: "prompt",
      requiresApproval: false,
    };
  }
  return null;
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
    const embeddedObj = embedded as Record<string, unknown>;
    const parsed = copilotResponseSchema.safeParse(embedded);
    if (parsed.success) {
      const envelopeActions = Array.isArray(parsed.data.suggestedActions)
        ? parsed.data.suggestedActions
            .map((a) => normalizeSuggestedAction(a))
            .filter((a): a is CopilotSuggestedAction => a !== null)
        : undefined;
      return {
        ...parsed.data,
        suggestedActions: mergeSuggested(
          envelopeActions,
          heuristicSuggestedActions(meta),
        ),
      };
    }

    const answerFromEnvelope =
      typeof embeddedObj.answer === "string" ? embeddedObj.answer.trim() : "";
    if (answerFromEnvelope.length > 0 || embeddedObj.suggestedActions) {
      const envelopeActions = Array.isArray(embeddedObj.suggestedActions)
        ? embeddedObj.suggestedActions
            .map((a) => normalizeSuggestedAction(a))
            .filter((a): a is CopilotSuggestedAction => a !== null)
        : undefined;
      return {
        answer: answerFromEnvelope.length ? answerFromEnvelope : input.text.trim() || " ",
        confidence:
          typeof embeddedObj.confidence === "number" ? embeddedObj.confidence : undefined,
        sources: Array.isArray(embeddedObj.sources) ? embeddedObj.sources : undefined,
        suggestedActions: mergeSuggested(
          envelopeActions,
          heuristicSuggestedActions(meta),
        ),
        relatedEntities: undefined,
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

/** Extract LangGraph HITL interrupt fields from gRPC metadata_json. */
export function normalizeLangGraphHitlMetadata(meta: Record<string, unknown>) {
  return hitlGraphInterruptMetadataSchema.safeParse({
    humanApprovalRequired: meta.humanApprovalRequired ?? meta.human_approval_required,
    threadId: meta.threadId ?? meta.thread_id,
    runId: meta.runId ?? meta.run_id,
    checkpointId: meta.checkpointId ?? meta.checkpoint_id,
    approvalRequestId: meta.approvalRequestId ?? meta.approval_request_id,
  });
}

function parsePhase3FromCopilotEnvelope(
  embedded: Record<string, unknown>,
): Pick<
  CopilotRailMetadata,
  "selectedCaseSummary" | "warrantyEligibility" | "diagnosisDraft"
> {
  const selected = selectedCaseSummarySchema.safeParse(embedded.selectedCaseSummary);
  const warranty = parseWarrantyEligibility(embedded.warrantyEligibility);
  const diagnosis = parseDiagnosisDraft(embedded.diagnosisDraft);
  return {
    ...(selected.success ? { selectedCaseSummary: selected.data } : {}),
    ...(warranty ? { warrantyEligibility: warranty } : {}),
    ...(diagnosis ? { diagnosisDraft: diagnosis } : {}),
  };
}

export function toRailMetadata(
  response: CopilotResponse,
  backend: "grpc" | "gemini_node",
  extras?: {
    pendingApprovals?: HitlRequest[];
    workflowExecutionStatus?: CopilotRailMetadata["workflowExecutionStatus"];
    lastDecision?: CopilotRailMetadata["lastDecision"];
    executionContext?: Record<string, unknown>;
    phase3FromEnvelope?: Pick<
      CopilotRailMetadata,
      "selectedCaseSummary" | "warrantyEligibility" | "diagnosisDraft"
    >;
    reasoningTrace?: CopilotRailMetadata["reasoningTrace"];
    latestReasoningEvent?: CopilotRailMetadata["latestReasoningEvent"];
  },
): CopilotRailMetadata {
  const raw: Record<string, unknown> = {
    confidence: response.confidence,
    sources: response.sources,
    suggestedActions: response.suggestedActions,
    relatedEntities: response.relatedEntities,
    pendingApprovals: extras?.pendingApprovals,
    workflowExecutionStatus: extras?.workflowExecutionStatus,
    lastDecision: extras?.lastDecision,
    backend,
    reasoningTrace: extras?.reasoningTrace,
    latestReasoningEvent: extras?.latestReasoningEvent,
    ...extras?.phase3FromEnvelope,
  };

  const merged = mergePhase3RailFields(raw, extras?.executionContext);
  const parsed = copilotRailMetadataSchema.safeParse(merged);

  if (!parsed.success) {
    console.warn(
      "[BFF Warning] toRailMetadata schema parsing failed:",
      z.treeifyError(parsed.error),
    );
    const fallbackSummary = extras?.executionContext
      ? parseSelectedCaseSummaryFromExecutionContext(extras.executionContext)
      : undefined;
    return {
      backend,
      ...(fallbackSummary ? { selectedCaseSummary: fallbackSummary } : {}),
    };
  }

  return parsed.data;
}

export { parsePhase3FromCopilotEnvelope };
