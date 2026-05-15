/**
 * Unit Test: PermissionResolverService
 *
 * Tests the full resolution pipeline:
 *   cache hit / miss → userRole fetch → closure traversal → permission aggregation → cache write
 *
 * All external dependencies (UserRoleRepository, RoleClosureRepository,
 * RolePermissionRepository, PermissionCacheService) are mocked with vi.fn().
 */
import { describe, it, expect, vi } from 'vitest'

import { PermissionResolverService } from '../services/permission-resolver.service'
import type { UserRoleRepository } from '../repositories/user-role.repository'
import type { RoleClosureRepository } from '../repositories/role-closure.repository'
import type { RolePermissionRepository } from '../repositories/role-permission.repository'
import type { PermissionCacheService } from '../services/permission-cache.service'

import { ROLES, ROLE_CLOSURES, ROLE_PERMISSIONS } from './rbac.fixtures'

// ─── Mock factory ─────────────────────────────────────────────────────────────

function createMocks() {
  const userRoleRepo = {
    findManyByUserId: vi.fn(),
  } as unknown as UserRoleRepository

  const roleClosureRepo = {
    findManyByDescendantIds: vi.fn(),
  } as unknown as RoleClosureRepository

  const rolePermissionRepo = {
    findPermissionNamesByRoleIds: vi.fn(),
  } as unknown as RolePermissionRepository

  const cacheService = {
    get: vi.fn(),
    set: vi.fn(),
  } as unknown as PermissionCacheService

  const service = new PermissionResolverService(
    userRoleRepo,
    roleClosureRepo,
    rolePermissionRepo,
    cacheService,
  )

  return { service, userRoleRepo, roleClosureRepo, rolePermissionRepo, cacheService }
}

// ─── Test data helpers ────────────────────────────────────────────────────────

const USER_ID = 'user-test-001'

function closureRowsForDescendant(descendantIds: string[]) {
  return ROLE_CLOSURES
    .filter((c) => descendantIds.includes(c.descendantId))
    .map((c) => ({ ancestorId: c.ancestorId }))
}

function permissionNamesForRoles(roleIds: string[]) {
  return [
    ...new Set(
      ROLE_PERMISSIONS
        .filter((rp) => roleIds.includes(rp.roleId))
        .map((rp) => rp.permissionName),
    ),
  ]
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PermissionResolverService.resolveForUser()', () => {
  describe('Cache behavior', () => {
    it('returns cached permissions without hitting DB (cache hit)', async () => {
      const { service, userRoleRepo, cacheService } = createMocks()
      ;(cacheService.get as ReturnType<typeof vi.fn>).mockResolvedValue(['users.read', 'users.write'])

      const result = await service.resolveForUser(USER_ID)

      expect(result).toEqual(['users.read', 'users.write'])
      expect(userRoleRepo.findManyByUserId).not.toHaveBeenCalled()
    })

    it('queries DB and populates cache on cache miss', async () => {
      const { service, userRoleRepo, roleClosureRepo, rolePermissionRepo, cacheService } = createMocks()
      ;(cacheService.get as ReturnType<typeof vi.fn>).mockResolvedValue(null)
      ;(userRoleRepo.findManyByUserId as ReturnType<typeof vi.fn>).mockResolvedValue([
        { roleId: ROLES.STAFF.id, role: { name: ROLES.STAFF.name } },
      ])
      ;(roleClosureRepo.findManyByDescendantIds as ReturnType<typeof vi.fn>).mockResolvedValue(
        closureRowsForDescendant([ROLES.STAFF.id]),
      )
      const ancestorIds = closureRowsForDescendant([ROLES.STAFF.id]).map((r) => r.ancestorId)
      const expectedPerms = permissionNamesForRoles(ancestorIds)
      ;(rolePermissionRepo.findPermissionNamesByRoleIds as ReturnType<typeof vi.fn>).mockResolvedValue(expectedPerms)

      await service.resolveForUser(USER_ID)

      expect(cacheService.set).toHaveBeenCalledWith(USER_ID, expectedPerms)
    })
  })

  describe('Admin bypass', () => {
    it('returns ["*"] for ADMIN role — wildcard bypass', async () => {
      const { service, userRoleRepo, cacheService } = createMocks()
      ;(cacheService.get as ReturnType<typeof vi.fn>).mockResolvedValue(null)
      ;(userRoleRepo.findManyByUserId as ReturnType<typeof vi.fn>).mockResolvedValue([
        { roleId: ROLES.ADMIN.id, role: { name: 'admin' } },
      ])

      const result = await service.resolveForUser(USER_ID)

      expect(result).toEqual(['*'])
    })

    it('returns ["*"] for SUPER_ADMIN role — wildcard bypass', async () => {
      const { service, userRoleRepo, cacheService } = createMocks()
      ;(cacheService.get as ReturnType<typeof vi.fn>).mockResolvedValue(null)
      ;(userRoleRepo.findManyByUserId as ReturnType<typeof vi.fn>).mockResolvedValue([
        { roleId: ROLES.SUPER_ADMIN.id, role: { name: 'super_admin' } },
      ])

      const result = await service.resolveForUser(USER_ID)

      expect(result).toEqual(['*'])
    })
  })

  describe('Empty user roles', () => {
    it('returns [] and caches empty array when user has no assigned roles', async () => {
      const { service, userRoleRepo, cacheService } = createMocks()
      ;(cacheService.get as ReturnType<typeof vi.fn>).mockResolvedValue(null)
      ;(userRoleRepo.findManyByUserId as ReturnType<typeof vi.fn>).mockResolvedValue([])

      const result = await service.resolveForUser(USER_ID)

      expect(result).toEqual([])
      expect(cacheService.set).toHaveBeenCalledWith(USER_ID, [])
    })
  })

  describe('Hierarchy direction — permissions flow DOWN (ancestor → descendant)', () => {
    it('STAFF user inherits permissions from MANAGER, ADMIN, SUPER_ADMIN ancestors', async () => {
      const { service, userRoleRepo, roleClosureRepo, rolePermissionRepo, cacheService } = createMocks()
      ;(cacheService.get as ReturnType<typeof vi.fn>).mockResolvedValue(null)
      ;(userRoleRepo.findManyByUserId as ReturnType<typeof vi.fn>).mockResolvedValue([
        { roleId: ROLES.STAFF.id, role: { name: ROLES.STAFF.name } },
      ])

      // Closure rows when querying descendant = STAFF
      ;(roleClosureRepo.findManyByDescendantIds as ReturnType<typeof vi.fn>).mockResolvedValue(
        closureRowsForDescendant([ROLES.STAFF.id]),
      )

      // All ancestor role IDs for STAFF
      const allAncestorIds = closureRowsForDescendant([ROLES.STAFF.id]).map((r) => r.ancestorId)
      const expectedPerms = permissionNamesForRoles(allAncestorIds)
      ;(rolePermissionRepo.findPermissionNamesByRoleIds as ReturnType<typeof vi.fn>).mockResolvedValue(expectedPerms)

      const result = await service.resolveForUser(USER_ID)

      // STAFF should inherit: users.read, users.write (from ADMIN), invoice.approve (from MANAGER)
      expect(result).toContain('users.read')
      expect(result).toContain('users.write')
      expect(result).toContain('invoice.approve')
    })

    it('reverse: ADMIN permissions do NOT flow to MANAGER (downward direction only)', async () => {
      // MANAGER user should have invoice.approve (own) + users.read, users.write (from ADMIN ancestor)
      // But ADMIN should NOT get invoice.approve (MANAGER is a descendant, not an ancestor of ADMIN)
      const { service, userRoleRepo, roleClosureRepo, cacheService } = createMocks()
      ;(cacheService.get as ReturnType<typeof vi.fn>).mockResolvedValue(null)
      ;(userRoleRepo.findManyByUserId as ReturnType<typeof vi.fn>).mockResolvedValue([
        { roleId: ROLES.ADMIN.id, role: { name: 'admin' } }, // ADMIN user — gets wildcard bypass
      ])

      const result = await service.resolveForUser(USER_ID)

      // Admin bypass applied — wildcard returned, no DB query for closure
      expect(result).toEqual(['*'])
      expect(roleClosureRepo.findManyByDescendantIds).not.toHaveBeenCalled()
    })
  })

  describe('Multiple assigned roles', () => {
    it('merges permissions from two independent roles', async () => {
      const { service, userRoleRepo, roleClosureRepo, rolePermissionRepo, cacheService } = createMocks()
      ;(cacheService.get as ReturnType<typeof vi.fn>).mockResolvedValue(null)
      ;(userRoleRepo.findManyByUserId as ReturnType<typeof vi.fn>).mockResolvedValue([
        { roleId: ROLES.STAFF.id,   role: { name: ROLES.STAFF.name } },
        { roleId: ROLES.SUPPORT.id, role: { name: ROLES.SUPPORT.name } },
      ])
      ;(roleClosureRepo.findManyByDescendantIds as ReturnType<typeof vi.fn>).mockResolvedValue(
        closureRowsForDescendant([ROLES.STAFF.id, ROLES.SUPPORT.id]),
      )

      const allAncestorIds = closureRowsForDescendant([ROLES.STAFF.id, ROLES.SUPPORT.id])
        .map((r) => r.ancestorId)
      const expectedPerms = permissionNamesForRoles(allAncestorIds)
      ;(rolePermissionRepo.findPermissionNamesByRoleIds as ReturnType<typeof vi.fn>).mockResolvedValue(expectedPerms)

      const result = await service.resolveForUser(USER_ID)

      // Both paths combined
      expect(result).toContain('users.read')
      expect(result).toContain('users.write')
      expect(result).toContain('invoice.approve')
    })
  })
})
