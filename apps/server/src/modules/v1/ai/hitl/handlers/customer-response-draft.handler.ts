import prisma from "@/core/infra/prisma";
import { customerResponseDraftPayloadSchema } from "@servexa-warranty-ai/ai-contracts";

export async function customerResponseDraftHandler(
  payload: Record<string, unknown>,
  userId: string,
  hitlRequestId: string,
): Promise<Record<string, unknown>> {
  const parsed = customerResponseDraftPayloadSchema.parse(payload);

  const existing = await prisma.repairCase.findUnique({
    where: { id: parsed.repairCaseId },
    select: { id: true, caseNumber: true },
  });
  if (!existing) {
    throw new Error("REPAIR_CASE_NOT_FOUND");
  }

  const draft = await prisma.aiCustomerResponseDraft.create({
    data: {
      repairCaseId: parsed.repairCaseId,
      body: parsed.body,
      status: "draft",
      hitlRequestId,
      createdByUserId: userId,
    },
  });

  return {
    draftId: draft.id,
    repairCaseId: parsed.repairCaseId,
    caseNumber: parsed.caseNumber ?? existing.caseNumber,
    status: "draft",
  };
}
