import prisma from "@/core/infra/prisma";

import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { createOperationalError } from "@/middlewares/error-middleware";
import { RolesScope } from "@/enums/roles-scope";
import { userHasPermission } from "@/modules/v1/ai/hitl/hitl-permissions";
import type { AccessTokenPayload } from "@/types/jwt";

export type RepairCaseAccessRow = {
  id: string;
  ascCenterId: string;
};

export async function loadRepairCaseForAccess(
  repairCaseId: string,
): Promise<RepairCaseAccessRow | null> {
  return prisma.repairCase.findUnique({
    where: { id: repairCaseId },
    select: { id: true, ascCenterId: true },
  });
}

export async function loadUserAscCenterId(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { ascCenterId: true },
  });
  return user?.ascCenterId ?? null;
}

/** HQ / system roles bypass ASC scoping. */
export function isAscScopeBypass(user: AccessTokenPayload): boolean {
  const perms = user.permissions ?? [];
  if (perms.includes("*")) return true;
  return user.roleScope === RolesScope.SYSTEM || user.roleScope === RolesScope.COMPANY;
}

export async function assertRepairCaseAscAccess(
  user: AccessTokenPayload,
  repairCaseId: string | null | undefined,
): Promise<RepairCaseAccessRow | null> {
  if (!repairCaseId) return null;

  const repairCase = await loadRepairCaseForAccess(repairCaseId);
  if (!repairCase) {
    throw createOperationalError("Repair case not found", HTTP_RESPONSE_CODE.NOT_FOUND);
  }

  if (isAscScopeBypass(user)) {
    return repairCase;
  }

  if (user.roleScope === RolesScope.ASC) {
    const userAscId = await loadUserAscCenterId(user.id);
    if (!userAscId || userAscId !== repairCase.ascCenterId) {
      throw createOperationalError("Forbidden", HTTP_RESPONSE_CODE.FORBIDDEN);
    }
  }

  return repairCase;
}

export function userCanSuperviseHitl(
  user: AccessTokenPayload,
  _kind: string,
  permission: string | undefined,
): boolean {
  if (!permission) return false;
  return userHasPermission(user.permissions ?? [], permission);
}
