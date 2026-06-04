import prisma from '@/core/infra/prisma';
import { Prisma } from '@/core/infra/prisma/generated/client';

type RolePermissionQuery = Prisma.RolePermissionSelect | undefined;
type RolePermissionInclude =
  | Prisma.RolePermissionInclude
  | undefined;
type RolePermissionResult = Prisma.RolePermissionGetPayload<{
  select: RolePermissionQuery;
  include: RolePermissionInclude;
}>;

export class RolePermissionRepository {

  findFirstByRoleIdPermissionName(
    ancestorRoleIds: string[],
    permissionName: string,
    options?: { select?: RolePermissionQuery; include?: RolePermissionInclude },
  ): Promise<RolePermissionResult | null> {
    return prisma.rolePermission.findFirst({
      where: {
        roleId: { in: ancestorRoleIds },
        permission: { name: permissionName },
      },
      ...options,
    });
  }

  async findManyByRoleIds({
    roleIds,
    options,
  }: {
    roleIds: string[];
    options?: { select?: RolePermissionQuery; include?: RolePermissionInclude };
  }): Promise<RolePermissionResult[]> {
    const buildQuery = await prisma.rolePermission.findMany({
      where: { roleId: { in: roleIds } },
      ...options,
    });
    return buildQuery;
  }

  async findPermissionNamesByRoleIds(roleIds: string[]): Promise<string[]> {
    const rows = await prisma.rolePermission.findMany({
      where: { roleId: { in: roleIds } },
      select: { permission: { select: { name: true } } },
    })
    return [...new Set(rows.map((r) => r.permission.name))]
  }
}
