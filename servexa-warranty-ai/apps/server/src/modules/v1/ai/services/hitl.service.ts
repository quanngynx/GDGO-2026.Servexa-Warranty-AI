import {
  customerResponseDraftPayloadSchema,
  hitlActionKindSchema,
  isValidHitlStatusTransition,
  repairEscalationPayloadSchema,
  technicianAssignmentPayloadSchema,
  type HitlActionKind,
  type HitlRequest,
  type HitlResumeResponse,
} from "@servexa-warranty-ai/ai-contracts";
import type { AiHitlActionKind, AiHitlRiskLevel } from "@servexa-warranty-ai/db/prisma/client";

import { env } from "@servexa-warranty-ai/env/server";

import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { resumeAiGrpcGraph } from "@/core/infra/grpc/ai-grpc.client";
import { createOperationalError } from "@/middlewares/error-middleware";
import { logAiAuditEvent } from "@/modules/v1/ai/governance/ai-audit";
import { publishHitlEvent } from "@/modules/v1/ai/governance/hitl-event-publisher";
import { getHitlHandler, isRegisteredHitlKind } from "@/modules/v1/ai/hitl-action-registry";
import { toHitlRequest } from "@/modules/v1/ai/hitl/hitl.mapper";
import {
  HITL_CREATE_ANY_PERMISSIONS,
  permissionForHitlKind,
  userHasAnyPermission,
  userHasPermission,
} from "@/modules/v1/ai/hitl/hitl-permissions";
import { assertRepairCaseAscAccess, loadUserAscCenterId, userCanSuperviseHitl } from "@/modules/v1/ai/hitl/policy/repair-case-access";
import { assertRepairCaseExists } from "@/modules/v1/ai/hitl/handlers/repair-escalation.handler";
import { toInputJsonValue } from "@/modules/v1/ai/hitl/prisma-json";
import type { IHitlRequestRepository } from "@/modules/v1/ai/interfaces/hitl-request-repository.interface";
import type { SubmitHitlDecisionInput } from "@/modules/v1/ai/schemas/hitl.schema";
import { PrismaHitlRequestRepository } from "@/modules/v1/ai/repositories/hitl-request.repository";
import type { AccessTokenPayload } from "@/types/jwt";

export type CreateHitlRequestBody = {
  kind: HitlActionKind;
  title: string;
  description: string;
  payload: Record<string, unknown>;
  evidenceSourceIds?: string[];
  confidence?: number;
  riskLevel?: "low" | "medium" | "high" | "critical";
  langGraphThreadId?: string;
  langGraphRunId?: string;
  langGraphCheckpointId?: string;
};

export type ListHitlScope = "mine" | "asc" | "all";

function validatePayload(kind: HitlActionKind, payload: Record<string, unknown>): void {
  switch (kind) {
    case "repair_escalation":
      repairEscalationPayloadSchema.parse(payload);
      break;
    case "technician_assignment":
      technicianAssignmentPayloadSchema.parse(payload);
      break;
    case "customer_response_draft":
      customerResponseDraftPayloadSchema.parse(payload);
      break;
    default:
      throw createOperationalError(
        `Action kind not enabled in Phase 2: ${kind}`,
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
  }
}

function extractRepairCaseId(payload: Record<string, unknown>): string | null {
  const id = payload.repairCaseId;
  return typeof id === "string" && id.length > 0 ? id : null;
}

function payloadFromRow(row: { payloadJson: unknown }): Record<string, unknown> {
  if (row.payloadJson && typeof row.payloadJson === "object" && !Array.isArray(row.payloadJson)) {
    return { ...(row.payloadJson as Record<string, unknown>) };
  }
  return {};
}

export class HitlService {
  constructor(
    private readonly repo: IHitlRequestRepository = new PrismaHitlRequestRepository(),
  ) {}

  private async expireStalePendingIfConfigured(): Promise<void> {
    const ttlHours = env.HITL_PENDING_TTL_HOURS;
    if (ttlHours <= 0) return;
    const olderThan = new Date(Date.now() - ttlHours * 60 * 60 * 1000);
    await this.repo.expireStalePending(olderThan);
  }

  private async assertCanView(user: AccessTokenPayload, row: {
    id: string;
    createdByUserId: string;
    kind: string;
    repairCaseId: string | null;
  }): Promise<void> {
    if (row.createdByUserId === user.id) return;

    const perm = permissionForHitlKind(row.kind as HitlActionKind);
    if (!perm || !userCanSuperviseHitl(user, row.kind, perm)) {
      throw createOperationalError("Forbidden", HTTP_RESPONSE_CODE.FORBIDDEN);
    }

    await assertRepairCaseAscAccess(user, row.repairCaseId);
  }

  private async assertCanDecide(user: AccessTokenPayload, row: {
    createdByUserId: string;
    kind: string;
    repairCaseId: string | null;
  }): Promise<void> {
    if (row.createdByUserId === user.id) return;

    const perm = permissionForHitlKind(row.kind as HitlActionKind);
    if (!perm || !userCanSuperviseHitl(user, row.kind, perm)) {
      throw createOperationalError("Forbidden", HTTP_RESPONSE_CODE.FORBIDDEN);
    }

    await assertRepairCaseAscAccess(user, row.repairCaseId);
  }

  async createRequest(
    user: AccessTokenPayload,
    body: CreateHitlRequestBody,
  ): Promise<HitlRequest> {
    const kind = hitlActionKindSchema.parse(body.kind);
    if (!isRegisteredHitlKind(kind)) {
      throw createOperationalError("Unknown HITL action kind", HTTP_RESPONSE_CODE.BAD_REQUEST);
    }

    const perm = permissionForHitlKind(kind);
    if (!perm || !userHasPermission(user.permissions ?? [], perm)) {
      throw createOperationalError("Forbidden", HTTP_RESPONSE_CODE.FORBIDDEN);
    }

    validatePayload(kind, body.payload);
    const repairCaseId = extractRepairCaseId(body.payload);
    if (repairCaseId) {
      try {
        await assertRepairCaseExists(repairCaseId);
        await assertRepairCaseAscAccess(user, repairCaseId);
      } catch (err) {
        if (err instanceof Error && err.message === "Forbidden") throw err;
        throw createOperationalError("Repair case not found", HTTP_RESPONSE_CODE.NOT_FOUND);
      }
    }

    const row = await this.repo.create({
      kind: kind as AiHitlActionKind,
      title: body.title,
      description: body.description,
      payloadJson: toInputJsonValue(body.payload),
      riskLevel: body.riskLevel as AiHitlRiskLevel | undefined,
      confidence: body.confidence,
      repairCaseId,
      createdByUserId: user.id,
      langGraphThreadId: body.langGraphThreadId ?? null,
      langGraphRunId: body.langGraphRunId ?? null,
      langGraphCheckpointId: body.langGraphCheckpointId ?? null,
    });

    logAiAuditEvent("hitl.request.created", {
      userId: user.id,
      requestId: row.id,
      kind,
      repairCaseId,
    });
    publishHitlEvent("hitl.request.created", {
      requestId: row.id,
      tenantId: "",
      userId: user.id,
      kind,
      payload: body.payload,
    });

    return toHitlRequest(row);
  }

  async createFromGraphInterrupt(
    user: AccessTokenPayload,
    input: CreateHitlRequestBody & {
      langGraphThreadId: string;
    },
  ): Promise<HitlRequest | null> {
    const existing = await this.repo.findByLangGraphThreadId(input.langGraphThreadId);
    if (existing) return toHitlRequest(existing);

    if (!userHasAnyPermission(user.permissions ?? [], HITL_CREATE_ANY_PERMISSIONS)) {
      return null;
    }

    return this.createRequest(user, input);
  }

  async listPending(
    user: AccessTokenPayload,
    scope: ListHitlScope = "mine",
  ): Promise<HitlRequest[]> {
    await this.expireStalePendingIfConfigured();

    if (scope === "all" && !userHasPermission(user.permissions ?? [], "*")) {
      throw createOperationalError("Forbidden", HTTP_RESPONSE_CODE.FORBIDDEN);
    }

    const ascCenterId =
      scope === "asc" ? await loadUserAscCenterId(user.id) : null;

    const supervisorKinds = (["repair_escalation", "technician_assignment", "customer_response_draft"] as const).filter(
      (k) => userCanSuperviseHitl(user, k, permissionForHitlKind(k)),
    ) as AiHitlActionKind[];

    const rows = await this.repo.listPending({
      userId: user.id,
      scope,
      ascCenterId,
      supervisorKinds: scope === "asc" ? supervisorKinds : undefined,
    });

    return rows.map(toHitlRequest);
  }

  async getById(user: AccessTokenPayload, id: string): Promise<HitlRequest> {
    const row = await this.repo.findById(id);
    if (!row) {
      throw createOperationalError("HITL request not found", HTTP_RESPONSE_CODE.NOT_FOUND);
    }
    await this.assertCanView(user, row);
    return toHitlRequest(row);
  }

  async submitDecision(
    user: AccessTokenPayload,
    id: string,
    decision: SubmitHitlDecisionInput,
  ): Promise<HitlRequest> {
    const row = await this.repo.findById(id);
    if (!row) {
      throw createOperationalError("HITL request not found", HTTP_RESPONSE_CODE.NOT_FOUND);
    }
    await this.assertCanDecide(user, row);

    if (row.status !== "pending" && row.status !== "edited") {
      throw createOperationalError(
        "Request is not awaiting a decision",
        HTTP_RESPONSE_CODE.CONFLICT,
      );
    }

    let nextStatus: "approved" | "rejected" | "edited";
    if (decision.decision === "approve") {
      nextStatus = "approved";
    } else if (decision.decision === "reject") {
      nextStatus = "rejected";
    } else {
      nextStatus = "edited";
    }

    if (!isValidHitlStatusTransition(row.status, nextStatus)) {
      throw createOperationalError("Invalid status transition", HTTP_RESPONSE_CODE.CONFLICT);
    }

    const payload = payloadFromRow(row);
    if (decision.editedPayload) {
      Object.assign(payload, decision.editedPayload);
    }
    if (decision.reason && nextStatus !== "rejected") {
      payload.reason = decision.reason;
    }

    let updated = await this.repo.saveDecision(id, {
      status: nextStatus,
      decidedByUserId: user.id,
      decidedAt: new Date(),
      decisionJson: toInputJsonValue({ requestId: id, ...decision }),
      payloadJson: toInputJsonValue(payload),
    });

    logAiAuditEvent(`hitl.request.${nextStatus}`, {
      userId: user.id,
      requestId: id,
      kind: row.kind,
      decision: decision.decision,
    });
    publishHitlEvent("hitl.request.decided", {
      requestId: id,
      tenantId: "",
      userId: user.id,
      kind: row.kind as HitlActionKind,
      payload: { decision: decision.decision, reason: decision.reason },
    });

    if (nextStatus === "rejected" || nextStatus === "edited") {
      return toHitlRequest(updated);
    }

    const hasGraph = Boolean(row.langGraphThreadId);

    try {
      validatePayload(row.kind as HitlActionKind, payload);
      const repairCaseId = extractRepairCaseId(payload);
      if (repairCaseId) {
        await assertRepairCaseAscAccess(user, repairCaseId);
      }

      const handler = getHitlHandler(row.kind as HitlActionKind);
      const result = await handler(payload, { userId: user.id, requestId: id });

      updated = await this.repo.markExecuted(
        id,
        toInputJsonValue({ ...payload, executionResult: result }),
      );

      logAiAuditEvent("hitl.action.executed", {
        userId: user.id,
        requestId: id,
        kind: row.kind,
        result,
      });
      publishHitlEvent("hitl.action.executed", {
        requestId: id,
        tenantId: "",
        userId: user.id,
        kind: row.kind as HitlActionKind,
        payload: result,
      });

      if (hasGraph) {
        logAiAuditEvent("hitl.request.edited", {
          userId: user.id,
          requestId: id,
          note: "awaiting graph resume",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      updated = await this.repo.markFailed(id, message);
      logAiAuditEvent("hitl.action.failed", {
        userId: user.id,
        requestId: id,
        kind: row.kind,
        error: message,
      });
      publishHitlEvent("hitl.action.failed", {
        requestId: id,
        tenantId: "",
        userId: user.id,
        kind: row.kind as HitlActionKind,
        payload: { error: message },
      });
    }

    return toHitlRequest(updated);
  }

  async resumeGraph(
    user: AccessTokenPayload,
    id: string,
  ): Promise<HitlResumeResponse> {
    const row = await this.repo.findById(id);
    if (!row) {
      throw createOperationalError("HITL request not found", HTTP_RESPONSE_CODE.NOT_FOUND);
    }
    await this.assertCanView(user, row);

    if (!row.langGraphThreadId) {
      throw createOperationalError(
        "Request has no LangGraph thread",
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
    }

    if (row.status !== "executed" && row.status !== "approved") {
      throw createOperationalError(
        "Request must be approved or executed before resume",
        HTTP_RESPONSE_CODE.CONFLICT,
      );
    }

    const decisionJson =
      row.decisionJson && typeof row.decisionJson === "object"
        ? JSON.stringify(row.decisionJson)
        : "{}";

    try {
      const out = await resumeAiGrpcGraph({
        threadId: row.langGraphThreadId,
        checkpointId: row.langGraphCheckpointId ?? "",
        approvalRequestId: row.id,
        decisionJson,
        traceId: row.langGraphRunId ?? row.id,
        userId: user.id,
      });

      logAiAuditEvent("hitl.graph.resumed", {
        userId: user.id,
        requestId: id,
        threadId: row.langGraphThreadId,
      });
      publishHitlEvent("hitl.graph.resumed", {
        requestId: id,
        tenantId: "",
        userId: user.id,
        kind: row.kind as HitlActionKind,
        payload: { graphResumed: true },
      });

      return {
        request: toHitlRequest(row),
        agentOutput: out.output,
        metadataJson: out.metadataJson,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logAiAuditEvent("hitl.action.failed", {
        userId: user.id,
        requestId: id,
        error: message,
        phase: "graph_resume",
      });
      throw createOperationalError(message, HTTP_RESPONSE_CODE.BAD_GATEWAY);
    }
  }
}
