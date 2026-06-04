/**
 * Unit Tests: Identity Repositories
 *
 * Tests RoleClosureRepository, RolePermissionRepository, UserRoleRepository
 * with a fully mocked Prisma client. Covers the uncovered DB method paths.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Hoist mock fns so vi.mock factory can reference them ────────────────────
// vi.mock() is hoisted to the top of the file by Vitest; variables declared
// with const/let are NOT hoisted. vi.hoisted() is the correct way to create
// variables that are available inside the factory.

const {
  mockRoleClosureFindMany,
  mockRoleClosureFindUnique,
  mockRoleClosureCreate,
  mockRoleClosureDeleteMany,
  mockRolePermissionFindFirst,
  mockRolePermissionFindMany,
  mockUserRoleFindUnique,
  mockUserRoleFindMany,
  mockUserRoleCreate,
} = vi.hoisted(() => ({
  mockRoleClosureFindMany: vi.fn(),
  mockRoleClosureFindUnique: vi.fn(),
  mockRoleClosureCreate: vi.fn(),
  mockRoleClosureDeleteMany: vi.fn(),
  mockRolePermissionFindFirst: vi.fn(),
  mockRolePermissionFindMany: vi.fn(),
  mockUserRoleFindUnique: vi.fn(),
  mockUserRoleFindMany: vi.fn(),
  mockUserRoleCreate: vi.fn(),
}))

vi.mock('@/core/infra/prisma', () => ({
  default: {
    roleClosure: {
      findMany: mockRoleClosureFindMany,
      findUnique: mockRoleClosureFindUnique,
      create: mockRoleClosureCreate,
      deleteMany: mockRoleClosureDeleteMany,
    },
    rolePermission: {
      findFirst: mockRolePermissionFindFirst,
      findMany: mockRolePermissionFindMany,
    },
    userRole: {
      findUnique: mockUserRoleFindUnique,
      findMany: mockUserRoleFindMany,
      create: mockUserRoleCreate,
    },
  },
  Prisma: {},
}))

import { RoleClosureRepository } from '../repositories/role-closure.repository'
import { RolePermissionRepository } from '../repositories/role-permission.repository'
import { UserRoleRepository } from '../repositories/user-role.repository'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const ANCESTOR_IDS = ['role-super-admin', 'role-admin']
const DESCENDANT_IDS = ['role-manager', 'role-staff']

// ─── RoleClosureRepository ────────────────────────────────────────────────────

describe('RoleClosureRepository', () => {
  let repo: RoleClosureRepository

  beforeEach(() => {
    vi.clearAllMocks()
    repo = new RoleClosureRepository()
  })

  it('findManyByAncestorIds — queries with ancestorId IN filter', async () => {
    const rows = [{ ancestorId: 'role-admin', descendantId: 'role-manager', depth: 1 }]
    mockRoleClosureFindMany.mockResolvedValue(rows)

    const result = await repo.findManyByAncestorIds(ANCESTOR_IDS)

    expect(mockRoleClosureFindMany).toHaveBeenCalledWith({
      where: { ancestorId: { in: ANCESTOR_IDS } },
    })
    expect(result).toEqual(rows)
  })

  it('findManyByAncestorIds — passes select option through', async () => {
    mockRoleClosureFindMany.mockResolvedValue([{ descendantId: 'role-staff' }])

    await repo.findManyByAncestorIds(ANCESTOR_IDS, { select: { descendantId: true } })

    expect(mockRoleClosureFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ select: { descendantId: true } }),
    )
  })

  it('findManyByDescendantIds — queries with descendantId IN filter', async () => {
    const rows = [{ ancestorId: 'role-admin', descendantId: 'role-manager', depth: 1 }]
    mockRoleClosureFindMany.mockResolvedValue(rows)

    const result = await repo.findManyByDescendantIds(DESCENDANT_IDS)

    expect(mockRoleClosureFindMany).toHaveBeenCalledWith({
      where: { descendantId: { in: DESCENDANT_IDS } },
    })
    expect(result).toEqual(rows)
  })

  it('findManyByDescendantIds — passes select option through', async () => {
    mockRoleClosureFindMany.mockResolvedValue([{ ancestorId: 'role-admin' }])

    await repo.findManyByDescendantIds(DESCENDANT_IDS, { select: { ancestorId: true } })

    expect(mockRoleClosureFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ select: { ancestorId: true } }),
    )
  })

  it('findManyAncestorByDescendantId — queries with descendantId and optional depth', async () => {
    const rows = [{ ancestorId: 'role-admin', descendantId: 'role-manager', depth: 1 }]
    mockRoleClosureFindMany.mockResolvedValue(rows)

    const result = await repo.findManyAncestorByDescendantId({
      descendantId: 'role-manager',
      depth: { gt: 0 },
    })

    expect(mockRoleClosureFindMany).toHaveBeenCalledWith({
      where: { descendantId: 'role-manager', depth: { gt: 0 } },
    })
    expect(result).toEqual(rows)
  })

  it('findManyDescendantByAncestorId — queries with ancestorId and optional depth', async () => {
    const rows = [{ ancestorId: 'role-admin', descendantId: 'role-staff', depth: 2 }]
    mockRoleClosureFindMany.mockResolvedValue(rows)

    const result = await repo.findManyDescendantByAncestorId({
      ancestorId: 'role-admin',
      depth: 2,
    })

    expect(mockRoleClosureFindMany).toHaveBeenCalledWith({
      where: { ancestorId: 'role-admin', depth: 2 },
    })
    expect(result).toEqual(rows)
  })

  it('findUniqueByAncestorIdDescendantIdWithTransaction — queries composite key via tx', async () => {
    const row = { ancestorId: 'role-admin', descendantId: 'role-manager', depth: 1 }
    const txFindUnique = vi.fn().mockResolvedValue(row)
    const mockTx = { roleClosure: { findUnique: txFindUnique } } as never

    const result = await repo.findUniqueByAncestorIdDescendantIdWithTransaction(
      mockTx,
      'role-admin',
      'role-manager',
    )

    expect(txFindUnique).toHaveBeenCalledWith({
      where: { ancestorId_descendantId: { ancestorId: 'role-admin', descendantId: 'role-manager' } },
    })
    expect(result).toEqual(row)
  })

  it('findUniqueByAncestorIdDescendantIdWithTransaction — returns null when not found', async () => {
    const txFindUnique = vi.fn().mockResolvedValue(null)
    const mockTx = { roleClosure: { findUnique: txFindUnique } } as never

    const result = await repo.findUniqueByAncestorIdDescendantIdWithTransaction(
      mockTx,
      'role-admin',
      'role-nonexistent',
    )

    expect(result).toBeNull()
  })

  it('createOne — creates a closure row', async () => {
    const data = { ancestor: { connect: { id: 'role-admin' } }, descendant: { connect: { id: 'role-manager' } }, depth: 1 }
    const created = { ancestorId: 'role-admin', descendantId: 'role-manager', depth: 1 }
    mockRoleClosureCreate.mockResolvedValue(created)

    const result = await repo.createOne(data as never)

    expect(mockRoleClosureCreate).toHaveBeenCalledWith({ data })
    expect(result).toEqual(created)
  })

  it('createOneWithTransaction — creates a closure row inside a transaction', async () => {
    const data = { ancestor: { connect: { id: 'role-admin' } }, descendant: { connect: { id: 'role-manager' } }, depth: 1 }
    const created = { ancestorId: 'role-admin', descendantId: 'role-manager', depth: 1 }
    const txCreate = vi.fn().mockResolvedValue(created)
    const mockTx = { roleClosure: { create: txCreate } } as never

    const result = await repo.createOneWithTransaction(mockTx, data as never)

    expect(txCreate).toHaveBeenCalledWith({ data })
    expect(result).toEqual(created)
  })

  it('deleteManyByAncestorIdDescendantIdWithTransaction — deletes matching rows', async () => {
    const txDeleteMany = vi.fn().mockResolvedValue({ count: 3 })
    const mockTx = { roleClosure: { deleteMany: txDeleteMany } } as never

    const result = await repo.deleteManyByAncestorIdDescendantIdWithTransaction({
      tx: mockTx,
      ancestorId: 'role-admin',
      descendantId: { in: ['role-manager', 'role-staff'] },
    })

    expect(txDeleteMany).toHaveBeenCalledWith({
      where: {
        ancestorId: 'role-admin',
        descendantId: { in: ['role-manager', 'role-staff'] },
        depth: undefined,
      },
    })
    expect(result).toEqual({ count: 3 })
  })
})

// ─── RolePermissionRepository ─────────────────────────────────────────────────

describe('RolePermissionRepository', () => {
  let repo: RolePermissionRepository

  beforeEach(() => {
    vi.clearAllMocks()
    repo = new RolePermissionRepository()
  })

  it('findFirstByRoleIdPermissionName — queries by roleIds and permissionName', async () => {
    const row = { roleId: 'role-admin', permissionId: 'perm-1' }
    mockRolePermissionFindFirst.mockResolvedValue(row)

    const result = await repo.findFirstByRoleIdPermissionName(
      ['role-admin', 'role-manager'],
      'users.read',
    )

    expect(mockRolePermissionFindFirst).toHaveBeenCalledWith({
      where: {
        roleId: { in: ['role-admin', 'role-manager'] },
        permission: { name: 'users.read' },
      },
    })
    expect(result).toEqual(row)
  })

  it('findFirstByRoleIdPermissionName — returns null when not found', async () => {
    mockRolePermissionFindFirst.mockResolvedValue(null)

    const result = await repo.findFirstByRoleIdPermissionName(['role-staff'], 'admin.super')

    expect(result).toBeNull()
  })

  it('findManyByRoleIds — returns permission rows for given roleIds', async () => {
    const rows = [{ roleId: 'role-admin', permissionId: 'perm-1' }]
    mockRolePermissionFindMany.mockResolvedValue(rows)

    const result = await repo.findManyByRoleIds({ roleIds: ['role-admin'] })

    expect(mockRolePermissionFindMany).toHaveBeenCalledWith({
      where: { roleId: { in: ['role-admin'] } },
    })
    expect(result).toEqual(rows)
  })

  it('findPermissionNamesByRoleIds — returns deduplicated permission names', async () => {
    mockRolePermissionFindMany.mockResolvedValue([
      { permission: { name: 'users.read' } },
      { permission: { name: 'users.write' } },
      { permission: { name: 'users.read' } }, // duplicate
    ])

    const result = await repo.findPermissionNamesByRoleIds(['role-admin'])

    expect(result).toEqual(['users.read', 'users.write'])
  })

  it('findPermissionNamesByRoleIds — returns empty array for roles with no permissions', async () => {
    mockRolePermissionFindMany.mockResolvedValue([])

    const result = await repo.findPermissionNamesByRoleIds(['role-empty'])

    expect(result).toEqual([])
  })
})

// ─── UserRoleRepository ───────────────────────────────────────────────────────

describe('UserRoleRepository', () => {
  let repo: UserRoleRepository

  beforeEach(() => {
    vi.clearAllMocks()
    repo = new UserRoleRepository()
  })

  it('findOneByUserIdRoleId — finds a user-role by composite key', async () => {
    const row = { userId: 'user-1', roleId: 'role-admin' }
    mockUserRoleFindUnique.mockResolvedValue(row)

    const result = await repo.findOneByUserIdRoleId('user-1', 'role-admin')

    expect(mockUserRoleFindUnique).toHaveBeenCalledWith({
      where: { userId_roleId: { userId: 'user-1', roleId: 'role-admin' } },
    })
    expect(result).toEqual(row)
  })

  it('findOneByUserIdRoleId — returns null when not assigned', async () => {
    mockUserRoleFindUnique.mockResolvedValue(null)

    const result = await repo.findOneByUserIdRoleId('user-ghost', 'role-admin')

    expect(result).toBeNull()
  })

  it('findManyByUserId — returns all role assignments for a user', async () => {
    const rows = [
      { userId: 'user-1', roleId: 'role-admin' },
      { userId: 'user-1', roleId: 'role-manager' },
    ]
    mockUserRoleFindMany.mockResolvedValue(rows)

    const result = await repo.findManyByUserId('user-1')

    expect(mockUserRoleFindMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
    })
    expect(result).toEqual(rows)
  })

  it('findManyByUserId — returns empty array for user with no roles', async () => {
    mockUserRoleFindMany.mockResolvedValue([])

    const result = await repo.findManyByUserId('user-no-roles')

    expect(result).toEqual([])
  })

  it('findManyByUserId — passes select option through', async () => {
    mockUserRoleFindMany.mockResolvedValue([{ roleId: 'role-admin' }])

    await repo.findManyByUserId('user-1', {
      select: { roleId: true, role: { select: { name: true } } },
    })

    expect(mockUserRoleFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: { roleId: true, role: { select: { name: true } } },
      }),
    )
  })

  it('createOne — creates a user-role assignment', async () => {
    const data = {
      user: { connect: { id: 'user-1' } },
      role: { connect: { id: 'role-admin' } },
    }
    const created = { userId: 'user-1', roleId: 'role-admin', assignedAt: new Date() }
    mockUserRoleCreate.mockResolvedValue(created)

    const result = await repo.createOne(data as never)

    expect(mockUserRoleCreate).toHaveBeenCalledWith({ data })
    expect(result).toEqual(created)
  })
})
