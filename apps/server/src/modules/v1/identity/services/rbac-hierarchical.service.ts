import { Roles } from '@/enums/roles';

import { UserRoleRepository } from '../repositories/user-role.repository';
import { RoleClosureRepository } from '../repositories/role-closure.repository';
import { RolePermissionRepository } from '../repositories/role-permission.repository';

import type { PermissionStrategy } from '../interfaces';
import logger from '@/core/logging/logging.config';
import type { UserRoleGetPayload } from '@/core/infra/prisma/generated/models';

type UserRolesInHasPermissionMethod = Pick<
  UserRoleGetPayload<{
    select: {
      roleId: true;
      role: {
        select: { name: true };
      };
    };
  }>,
  'roleId' | 'role'
>;

export class RbacHierarchicalStrategy implements PermissionStrategy {
  constructor(
    private userRoleRepository: UserRoleRepository,
    private roleClosureRepository: RoleClosureRepository,
    private rolePermissionRepository: RolePermissionRepository,
  ) {}

  async hasPermission(
    userId: string,
    permissionName: string,
    context?: Record<string, any>,
  ): Promise<boolean> {
    logger.info(
      `[RbacHierarchicalStrategy] hasPermission: ${permissionName} with context: ${JSON.stringify(context)}`,
    );

    // join closure table
    const userRoles = (await this.userRoleRepository.findManyByUserId(userId, {
      select: {
        roleId: true,
        role: {
          select: { name: true },
        },
      },
    })) as unknown as UserRolesInHasPermissionMethod[];

    if (userRoles.length === 0) return false;

    const roleIds = userRoles.map((userRole) => userRole.roleId);

    // policy: if user has role 'admin', then they have all permissions
    const isAdmin = userRoles.some(
      (userRole) => userRole.role.name === `${Roles.ADMIN}`,
    );
    if (isAdmin) return true;

    // =================================================================================
    const descendants = await this.roleClosureRepository.findManyByAncestorIds(
      roleIds,
      {
        select: { descendantId: true },
      },
    );

    // Fix: Remove duplicate descendantRoleIds
    // const descendantRoleIds = descendants.map((role) => role.descendantId);
    const descendantRoleIds = Array.from(
      new Set(descendants.map((role) => role.descendantId)),
    );

    const existingRolePermission =
      await this.rolePermissionRepository.findFirstByRoleIdPermissionName(
        descendantRoleIds,
        permissionName,
      );

    return !!existingRolePermission;
  }

  warmup?(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
