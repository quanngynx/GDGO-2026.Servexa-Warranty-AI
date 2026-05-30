import { describe, expect, it, vi, beforeEach } from "vitest";

import type { IHitlRequestRepository } from "@/modules/v1/ai/interfaces/hitl-request-repository.interface";
import { HitlService } from "@/modules/v1/ai/services/hitl.service";
import type { AccessTokenPayload } from "@/types/jwt";
import { Roles } from "src/enums/roles";
import { RolesScope } from "src/enums/roles-scope";

vi.mock("@/core/infra/grpc/ai-grpc.client", () => ({
  resumeAiGrpcGraph: vi.fn().mockResolvedValue({
    output: "Workflow resumed.",
    metadataJson: "{}",
  }),
}));

vi.mock("@/modules/v1/ai/hitl/policy/repair-case-access", () => ({
  assertRepairCaseAscAccess: vi.fn().mockResolvedValue(undefined),
  loadUserAscCenterId: vi.fn().mockResolvedValue(null),
  userCanSuperviseHitl: vi.fn().mockReturnValue(true),
}));

vi.mock("@/modules/v1/ai/hitl/handlers/repair-escalation.handler", () => ({
  assertRepairCaseExists: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/modules/v1/ai/hitl-action-registry", () => ({
  getHitlHandler: vi.fn().mockReturnValue(
    vi.fn().mockResolvedValue({ ok: true, repairCaseId: "rc-1" }),
  ),
  isRegisteredHitlKind: vi.fn().mockReturnValue(true),
}));

const mockUser: AccessTokenPayload = {
  id: "user-1",
  email: "u@test.com",
  username: "u",
  fullName: "User",
  role: Roles.ASC_MANAGER,
  roleScope: RolesScope.ASC,
  permissions: ["repair_case.update", "repair_case.assign", "customer_response.create"],
};

function buildRepo(overrides: Partial<IHitlRequestRepository> = {}): IHitlRequestRepository {
  const baseRow = {
    id: "req-1",
    kind: "repair_escalation" as const,
    status: "pending" as const,
    title: "Escalate",
    description: "Test",
    payloadJson: { repairCaseId: "rc-1", reason: "urgent" },
    decisionJson: null,
    createdByUserId: "user-2",
    decidedByUserId: null,
    repairCaseId: "rc-1",
    createdAt: new Date(),
    decidedAt: null,
    executedAt: null,
    riskLevel: "medium" as const,
    confidence: 0.9,
    errorMessage: null,
    langGraphThreadId: null,
    langGraphRunId: null,
    langGraphCheckpointId: null,
  };

  return {
    create: vi.fn(),
    findById: vi.fn().mockResolvedValue(baseRow),
    findByLangGraphThreadId: vi.fn().mockResolvedValue(null),
    listPending: vi.fn().mockResolvedValue([baseRow]),
    saveDecision: vi.fn().mockImplementation(async (id, data) => ({
      ...baseRow,
      id,
      status: data.status,
      decidedByUserId: data.decidedByUserId,
      decidedAt: data.decidedAt,
      decisionJson: data.decisionJson,
      payloadJson: data.payloadJson,
    })),
    markExecuted: vi.fn().mockImplementation(async (id, payloadJson) => ({
      ...baseRow,
      id,
      status: "executed",
      payloadJson,
      executedAt: new Date(),
    })),
    markFailed: vi.fn(),
    updateCheckpoint: vi.fn(),
    expireStalePending: vi.fn().mockResolvedValue(0),
    ...overrides,
  };
}

describe("HitlService integration (mocked repository)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("expires stale pending before listing", async () => {
    const repo = buildRepo();
    const service = new HitlService(repo);

    await service.listPending(mockUser, "mine");

    expect(repo.expireStalePending).toHaveBeenCalledOnce();
  });

  it("approve → execute repair escalation", async () => {
    const repo = buildRepo();
    const service = new HitlService(repo);

    const result = await service.submitDecision(mockUser, "req-1", {
      decision: "approve",
    });

    expect(result.status).toBe("executed");
    expect(repo.markExecuted).toHaveBeenCalled();
  });

  it("reject leaves request rejected without execution", async () => {
    const repo = buildRepo({
      saveDecision: vi.fn().mockImplementation(async (id, data) => ({
        ...(await buildRepo().findById!(id)),
        status: data.status,
        decidedByUserId: data.decidedByUserId,
      })),
    });
    const service = new HitlService(repo);

    const result = await service.submitDecision(mockUser, "req-1", {
      decision: "reject",
      reason: "not needed",
    });

    expect(result.status).toBe("rejected");
    expect(repo.markExecuted).not.toHaveBeenCalled();
  });

  it("resume graph when thread id present", async () => {
    const row = {
      ...(await buildRepo().findById!("req-1")),
      status: "executed" as const,
      langGraphThreadId: "thread-1",
      langGraphCheckpointId: "ckpt-1",
      decisionJson: { decision: "approve" },
    };
    const repo = buildRepo({
      findById: vi.fn().mockResolvedValue(row),
    });
    const service = new HitlService(repo);

    const out = await service.resumeGraph(mockUser, "req-1");

    expect(out.agentOutput).toContain("Workflow resumed");
  });
});
