import type {
  AiHitlActionKind,
  AiHitlRequestStatus,
  AiHitlRiskLevel,
  Prisma,
} from "@servexa-warranty-ai/db/prisma/client";

export type CreateHitlRequestInput = {
  kind: AiHitlActionKind;
  title: string;
  description: string;
  payloadJson: Prisma.InputJsonValue;
  riskLevel?: AiHitlRiskLevel;
  confidence?: number;
  repairCaseId?: string | null;
  createdByUserId: string;
  langGraphThreadId?: string | null;
  langGraphRunId?: string | null;
  langGraphCheckpointId?: string | null;
};

export type SaveHitlDecisionInput = {
  status: AiHitlRequestStatus;
  decidedByUserId: string;
  decidedAt: Date;
  decisionJson: Prisma.InputJsonValue;
  payloadJson: Prisma.InputJsonValue;
};

export type ListPendingOptions = {
  userId: string;
  ascCenterId?: string | null;
  scope: "mine" | "asc" | "all";
  supervisorKinds?: AiHitlActionKind[];
};

export interface IHitlRequestRepository {
  create(
    input: CreateHitlRequestInput,
  ): Promise<Prisma.AiHumanApprovalRequestGetPayload<object>>;
  findById(
    id: string,
  ): Promise<Prisma.AiHumanApprovalRequestGetPayload<object> | null>;
  findByLangGraphThreadId(
    threadId: string,
  ): Promise<Prisma.AiHumanApprovalRequestGetPayload<object> | null>;
  listPending(
    options: ListPendingOptions,
  ): Promise<Prisma.AiHumanApprovalRequestGetPayload<object>[]>;
  saveDecision(
    id: string,
    input: SaveHitlDecisionInput,
  ): Promise<Prisma.AiHumanApprovalRequestGetPayload<object>>;
  markExecuted(
    id: string,
    payloadJson: Prisma.InputJsonValue,
  ): Promise<Prisma.AiHumanApprovalRequestGetPayload<object>>;
  markFailed(
    id: string,
    errorMessage: string,
  ): Promise<Prisma.AiHumanApprovalRequestGetPayload<object>>;
  updateCheckpoint(
    id: string,
    data: {
      langGraphThreadId?: string | null;
      langGraphRunId?: string | null;
      langGraphCheckpointId?: string | null;
    },
  ): Promise<Prisma.AiHumanApprovalRequestGetPayload<object>>;
  expireStalePending(olderThan: Date): Promise<number>;
}
