import { z } from "zod";

import {
  hitlGraphInterruptMetadataSchema,
  type HitlRequest,
} from "./hitl";

import {
  copilotRailMetadataSchema,
  copilotResponseSchema,
  copilotSuggestedActionSchema,
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

export function toRailMetadata(
  response: CopilotResponse,
  backend: "grpc" | "gemini_node",
  extras?: {
    pendingApprovals?: HitlRequest[];
    workflowExecutionStatus?: CopilotRailMetadata["workflowExecutionStatus"];
    lastDecision?: CopilotRailMetadata["lastDecision"];
  },
): CopilotRailMetadata {
  const raw = {
    confidence: response.confidence,
    sources: response.sources,
    suggestedActions: response.suggestedActions,
    relatedEntities: response.relatedEntities,
    pendingApprovals: extras?.pendingApprovals,
    workflowExecutionStatus: extras?.workflowExecutionStatus,
    lastDecision: extras?.lastDecision,
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
