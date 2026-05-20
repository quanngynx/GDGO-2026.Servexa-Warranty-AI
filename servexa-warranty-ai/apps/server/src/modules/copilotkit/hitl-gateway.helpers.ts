import {
  hitlActionKindSchema,
  normalizeLangGraphHitlMetadata,
  parseMetadataJson,
  type HitlRequest,
} from "@servexa-warranty-ai/ai-contracts";

import { getCopilotRequestUser } from "@/modules/copilotkit/copilot-request-context";
import { HitlService } from "@/modules/v1/ai/services/hitl.service";

const hitlService = new HitlService();

export async function loadPendingApprovalsForGateway(): Promise<HitlRequest[]> {
  const user = getCopilotRequestUser();
  if (!user?.id) return [];
  try {
    return await hitlService.listPending(
      {
        id: user.id,
        email: user.email ?? "",
        username: user.email ?? "",
        fullName: user.email ?? "",
        role: user.role,
        roleScope: user.roleScope,
        permissions: user.permissions ?? [],
      },
      "asc",
    );
  } catch {
    return [];
  }
}

export async function ensureHitlFromInterruptMetadata(
  metadataJson: string,
): Promise<void> {
  const user = getCopilotRequestUser();
  if (!user?.id) return;

  const meta = parseMetadataJson(metadataJson);
  const graph = normalizeLangGraphHitlMetadata(meta);
  if (!graph.success || !graph.data.humanApprovalRequired) return;

  const threadId = graph.data.threadId;
  if (!threadId) return;

  const copilot = meta.copilot as Record<string, unknown> | undefined;
  const suggested = Array.isArray(copilot?.suggestedActions)
    ? (copilot.suggestedActions as Record<string, unknown>[])
    : [];
  const firstWorkflow = suggested.find((a) => a.kind === "workflow");
  if (!firstWorkflow?.workflowKind) return;

  const kind = hitlActionKindSchema.parse(firstWorkflow.workflowKind);

  await hitlService.createFromGraphInterrupt(
    {
      id: user.id,
      email: user.email ?? "",
      username: user.email ?? "",
      fullName: user.email ?? "",
      role: user.role,
      roleScope: user.roleScope,
      permissions: user.permissions ?? [],
    },
    {
      kind,
      title: String(firstWorkflow.label ?? "Approval required"),
      description: "LangGraph workflow paused for human approval.",
      payload: (firstWorkflow.payload as Record<string, unknown>) ?? {},
      langGraphThreadId: threadId,
      langGraphRunId: graph.data.runId,
      langGraphCheckpointId: graph.data.checkpointId,
    },
  );
}
