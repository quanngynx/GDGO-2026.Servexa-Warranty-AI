import prisma from "@/core/infra/prisma";
import { technicianAssignmentPayloadSchema } from "@servexa-warranty-ai/ai-contracts";

import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { createOperationalError } from "@/middlewares/error-middleware";
import { TechnicianService } from "@/modules/v1/human-resources/services/technician.service";

export async function technicianAssignmentHandler(
  payload: Record<string, unknown>,
  userId: string,
): Promise<Record<string, unknown>> {
  const parsed = technicianAssignmentPayloadSchema.parse(payload);
  if (!parsed.technicianId?.trim()) {
    throw createOperationalError(
      "Technician profile ID is required",
      HTTP_RESPONSE_CODE.BAD_REQUEST,
    );
  }

  const existing = await prisma.repairCase.findUnique({
    where: { id: parsed.repairCaseId },
    select: {
      id: true,
      caseNumber: true,
      ascCenterId: true,
      assignedTechnicianId: true,
      technicianName: true,
    },
  });
  if (!existing) {
    throw createOperationalError("Repair case not found", HTTP_RESPONSE_CODE.NOT_FOUND);
  }

  const technicianService = new TechnicianService();
  const profile = (await technicianService.findOneById(parsed.technicianId)) as {
    id: string;
    userId: string;
    isAvailable: boolean;
    maxConcurrentCases: number;
  };

  if (!profile.isAvailable) {
    throw createOperationalError(
      "Technician is not available",
      HTTP_RESPONSE_CODE.BAD_REQUEST,
    );
  }

  const activeAssignments = await prisma.repairCase.count({
    where: {
      assignedTechnicianId: parsed.technicianId,
      status: { notIn: ["hoanthanh", "huyphieu"] },
    },
  });

  if (activeAssignments >= profile.maxConcurrentCases) {
    throw createOperationalError(
      "Technician has reached maximum concurrent cases",
      HTTP_RESPONSE_CODE.CONFLICT,
    );
  }

  const techUser = await prisma.user.findUnique({
    where: { id: profile.userId },
    select: { ascCenterId: true, fullName: true },
  });

  if (techUser?.ascCenterId && techUser.ascCenterId !== existing.ascCenterId) {
    throw createOperationalError(
      "Technician is not assigned to this ASC",
      HTTP_RESPONSE_CODE.FORBIDDEN,
    );
  }

  const technicianName = parsed.technicianName ?? techUser?.fullName ?? existing.technicianName;

  const updated = await prisma.repairCase.update({
    where: { id: parsed.repairCaseId },
    data: {
      assignedTechnicianId: parsed.technicianId,
      technicianName,
    },
    select: { id: true, caseNumber: true, assignedTechnicianId: true, technicianName: true },
  });

  await prisma.repairCaseFieldHistory.create({
    data: {
      repairCaseId: parsed.repairCaseId,
      fieldName: "assignedTechnicianId",
      previousValue: existing.assignedTechnicianId
        ? JSON.stringify(existing.assignedTechnicianId)
        : null,
      newValue: JSON.stringify(parsed.technicianId),
      changedBy: userId,
    },
  });

  return {
    repairCaseId: updated.id,
    caseNumber: parsed.caseNumber ?? updated.caseNumber,
    technicianId: updated.assignedTechnicianId,
    technicianName: updated.technicianName,
  };
}
