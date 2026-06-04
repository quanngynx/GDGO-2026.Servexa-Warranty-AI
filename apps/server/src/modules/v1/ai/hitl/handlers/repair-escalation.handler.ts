import prisma from "@/core/infra/prisma";
import { repairEscalationPayloadSchema } from "@servexa-warranty-ai/ai-contracts";

import { RepairCaseService } from "@/modules/v1/asc-center/services/repair-case.service";

export async function repairEscalationHandler(
  payload: Record<string, unknown>,
  userId: string,
): Promise<Record<string, unknown>> {
  const parsed = repairEscalationPayloadSchema.parse(payload);
  const service = new RepairCaseService();
  const existing = await service.findOneById(parsed.repairCaseId);

  const noteLine = parsed.reason
    ? `[HITL escalation] ${parsed.reason}`
    : "[HITL escalation] Approved by operations copilot";
  const repairNotes = [existing.repairNotes, noteLine].filter(Boolean).join("\n");

  const previousStatus = existing.status;

  await service.update(
    parsed.repairCaseId,
    {
      priority: parsed.priority,
      repairNotes,
    },
    userId,
  );

  await prisma.repairCaseStatusHistory.create({
    data: {
      repairCaseId: parsed.repairCaseId,
      previousStatus,
      newStatus: previousStatus,
      changedBy: userId,
      reason: "hitl_escalation",
      notes: noteLine,
      metadata: { priority: parsed.priority, escalated: true },
    },
  });

  return {
    repairCaseId: parsed.repairCaseId,
    caseNumber: parsed.caseNumber ?? existing.caseNumber,
    priority: parsed.priority,
    escalated: true,
  };
}

export async function assertRepairCaseExists(repairCaseId: string): Promise<void> {
  const row = await prisma.repairCase.findUnique({
    where: { id: repairCaseId },
    select: { id: true },
  });
  if (!row) {
    throw new Error("REPAIR_CASE_NOT_FOUND");
  }
}
