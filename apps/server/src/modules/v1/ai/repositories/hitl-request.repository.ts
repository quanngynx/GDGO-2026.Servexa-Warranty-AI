import prisma from "@servexa-warranty-ai/db";
import type { Prisma } from "@servexa-warranty-ai/db/prisma/client";

import type {
  CreateHitlRequestInput,
  IHitlRequestRepository,
  ListPendingOptions,
  SaveHitlDecisionInput,
} from "@/modules/v1/ai/interfaces/hitl-request-repository.interface";

export class PrismaHitlRequestRepository implements IHitlRequestRepository {
  async create(input: CreateHitlRequestInput) {
    return prisma.aiHumanApprovalRequest.create({
      data: {
        kind: input.kind,
        title: input.title,
        description: input.description,
        payloadJson: input.payloadJson,
        riskLevel: input.riskLevel,
        confidence: input.confidence,
        repairCaseId: input.repairCaseId ?? null,
        langGraphThreadId: input.langGraphThreadId ?? null,
        langGraphRunId: input.langGraphRunId ?? null,
        langGraphCheckpointId: input.langGraphCheckpointId ?? null,
        createdByUserId: input.createdByUserId,
        status: "pending",
      },
    });
  }

  async findById(id: string) {
    return prisma.aiHumanApprovalRequest.findUnique({ where: { id } });
  }

  async findByLangGraphThreadId(threadId: string) {
    return prisma.aiHumanApprovalRequest.findFirst({
      where: { langGraphThreadId: threadId, status: "pending" },
      orderBy: { createdAt: "desc" },
    });
  }

  async listPending(options: ListPendingOptions) {
    const base: Prisma.AiHumanApprovalRequestWhereInput = { status: "pending" };

    if (options.scope === "mine") {
      return prisma.aiHumanApprovalRequest.findMany({
        where: { ...base, createdByUserId: options.userId },
        orderBy: { createdAt: "desc" },
      });
    }

    if (options.scope === "asc" && options.ascCenterId) {
      return prisma.aiHumanApprovalRequest.findMany({
        where: {
          ...base,
          OR: [
            { createdByUserId: options.userId },
            {
              repairCase: { ascCenterId: options.ascCenterId },
              ...(options.supervisorKinds?.length
                ? { kind: { in: options.supervisorKinds } }
                : {}),
            },
          ],
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (options.scope === "all") {
      return prisma.aiHumanApprovalRequest.findMany({
        where: base,
        orderBy: { createdAt: "desc" },
      });
    }

    return prisma.aiHumanApprovalRequest.findMany({
      where: { ...base, createdByUserId: options.userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async saveDecision(id: string, input: SaveHitlDecisionInput) {
    return prisma.aiHumanApprovalRequest.update({
      where: { id },
      data: {
        status: input.status,
        decidedByUserId: input.decidedByUserId,
        decidedAt: input.decidedAt,
        decisionJson: input.decisionJson,
        payloadJson: input.payloadJson,
      },
    });
  }

  async markExecuted(id: string, payloadJson: Prisma.InputJsonValue) {
    return prisma.aiHumanApprovalRequest.update({
      where: { id },
      data: {
        status: "executed",
        executedAt: new Date(),
        payloadJson,
      },
    });
  }

  async markFailed(id: string, errorMessage: string) {
    return prisma.aiHumanApprovalRequest.update({
      where: { id },
      data: {
        status: "failed",
        errorMessage,
      },
    });
  }

  async updateCheckpoint(
    id: string,
    data: {
      langGraphThreadId?: string | null;
      langGraphRunId?: string | null;
      langGraphCheckpointId?: string | null;
    },
  ) {
    return prisma.aiHumanApprovalRequest.update({
      where: { id },
      data,
    });
  }

  async expireStalePending(olderThan: Date): Promise<number> {
    const result = await prisma.aiHumanApprovalRequest.updateMany({
      where: {
        status: "pending",
        createdAt: { lt: olderThan },
      },
      data: { status: "expired" },
    });
    return result.count;
  }
}

/** @deprecated Use PrismaHitlRequestRepository */
export const HitlRequestRepository = PrismaHitlRequestRepository;
