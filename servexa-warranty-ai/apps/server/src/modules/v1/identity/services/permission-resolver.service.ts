import { Roles } from '@/enums/roles'
import logger from '@/core/logging/logging.config'

import { UserRoleRepository } from '../repositories/user-role.repository'
import { RoleClosureRepository } from '../repositories/role-closure.repository'
import { RolePermissionRepository } from '../repositories/role-permission.repository'
import { PermissionCacheService } from './permission-cache.service'

const ADMIN_ROLES = new Set<string>([Roles.ADMIN, Roles.SUPER_ADMIN])

/**
 * Resolves the complete effective permission set for a user by walking
 * UP the role closure table (ancestor direction).
 *
 * Inheritance rule (confirmed from role.service.ts):
 *   ancestor roles grant permissions DOWN to their descendants.
 *   → To resolve a user's permissions, collect all ancestor role IDs
 *     (including the user's own roles at depth=0) then fetch their permissions.
 */
export class PermissionResolverService {
  constructor(
    private readonly userRoleRepo: UserRoleRepository,
    private readonly roleClosureRepo: RoleClosureRepository,
    private readonly rolePermissionRepo: RolePermissionRepository,
    private readonly cacheService: PermissionCacheService,
  ) {}

  async resolveForUser(userId: string): Promise<string[]> {
    // 1. Cache hit
    const cached = await this.cacheService.get(userId)
    if (cached) {
      logger.debug(`[PermissionResolver] Cache hit for userId=${userId}`)
      return cached
    }

    // 2. Fetch user roles (with role name for admin bypass)
    const userRoles = await this.userRoleRepo.findManyByUserId(userId, {
      select: {
        roleId: true,
        role: { select: { name: true } },
      },
    }) as {
        id: string;
        userId: string;
        roleId: string;
        assignedAt: Date;
        role: {
          name: string;
        }
    }[]

    if (userRoles.length === 0) {
      await this.cacheService.set(userId, [])
      return []
    }

    // 3. Admin bypass — wildcard permissions
    const isAdmin = userRoles.some((ur) => ADMIN_ROLES.has(ur.role.name))
    if (isAdmin) {
      logger.debug(`[PermissionResolver] Admin bypass for userId=${userId}`)
      await this.cacheService.set(userId, ['*'])
      return ['*']
    }

    // 4. Collect role IDs
    const roleIds = userRoles.map((ur) => ur.roleId)

    // 5. Walk UP the closure table: find all ancestor role IDs (depth >= 0 includes self)
    //    findManyByDescendantIds(roleIds) returns rows where descendantId ∈ roleIds,
    //    giving us (ancestorId, descendantId) pairs — we want the ancestorId values.
    const closureRows = await this.roleClosureRepo.findManyByDescendantIds(roleIds, {
      select: { ancestorId: true },
    }) as Array<{ ancestorId: string }>

    const ancestorRoleIds = [...new Set(closureRows.map((r) => r.ancestorId))]

    // 6. Fetch all permission names from those ancestor roles
    const allRoleIds = [...new Set([...roleIds, ...ancestorRoleIds])]
    const permissions = await this.rolePermissionRepo.findPermissionNamesByRoleIds(allRoleIds)

    logger.debug(
      `[PermissionResolver] Resolved ${permissions.length} permissions for userId=${userId}`,
    )

    // 7. Cache and return
    await this.cacheService.set(userId, permissions)
    return permissions
  }
}
