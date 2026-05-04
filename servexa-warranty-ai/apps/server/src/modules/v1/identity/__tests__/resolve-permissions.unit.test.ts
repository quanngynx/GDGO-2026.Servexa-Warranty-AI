/**
 * Unit Test: resolvePermissions middleware (lines 30-58)
 *
 * Mocks PermissionResolverService so no DB/Redis hits.
 * Covers: success path, missing userId (401), service error (next(error)).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Request, Response, NextFunction } from 'express'

// ─── Mock the singleton dependencies before importing the middleware ──────────

const mockResolveForUser = vi.fn()

vi.mock('@/modules/v1/identity/repositories/user-role.repository', () => ({
  UserRoleRepository: vi.fn().mockImplementation(() => ({})),
}))
vi.mock('@/modules/v1/identity/repositories/role-closure.repository', () => ({
  RoleClosureRepository: vi.fn().mockImplementation(() => ({})),
}))
vi.mock('@/modules/v1/identity/repositories/role-permission.repository', () => ({
  RolePermissionRepository: vi.fn().mockImplementation(() => ({})),
}))
vi.mock('@/modules/v1/identity/services/permission-cache.service', () => ({
  PermissionCacheService: vi.fn().mockImplementation(() => ({})),
}))
vi.mock('@/modules/v1/identity/services/permission-resolver.service', () => ({
  PermissionResolverService: vi.fn().mockImplementation(() => ({
    resolveForUser: mockResolveForUser,
  })),
}))

// Import after mocks are registered
const { resolvePermissions } = await import('@/middlewares/require-permission.middleware')

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildReq(userId?: string): Partial<Request> {
  if (!userId) return {} as Partial<Request>
  return {
    user: {
      id: userId,
      email: 'test@test.com',
      username: 'tester',
      fullName: 'Tester',
      role: 'staff' as never,
      roleScope: 'system' as never,
      permissions: [],
      aud: 'access:common',
    },
  }
}

function buildNextFn() {
  return vi.fn() as unknown as NextFunction
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('resolvePermissions middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('resolves permissions and writes them to req.user.permissions (success path)', async () => {
    const resolvedPerms = ['users.read', 'invoice.approve']
    mockResolveForUser.mockResolvedValue(resolvedPerms)

    const req = buildReq('user-123') as Request
    const res = {} as Response
    const nextFn = buildNextFn()

    await resolvePermissions(req, res, nextFn)

    expect(mockResolveForUser).toHaveBeenCalledWith('user-123')
    expect(req.user!.permissions).toEqual(resolvedPerms)
    expect(nextFn).toHaveBeenCalledWith() // no error
  })

  it('returns 401 when req.user is absent (no userId)', async () => {
    const req = buildReq() as Request // no user
    const res = {} as Response
    const nextFn = buildNextFn()

    await resolvePermissions(req, res, nextFn)

    expect(mockResolveForUser).not.toHaveBeenCalled()
    expect(nextFn).toHaveBeenCalledOnce()
    const [err] = (nextFn as ReturnType<typeof vi.fn>).mock.calls[0] ?? []
    expect(err.statusCode).toBe(401)
  })

  it('calls next(error) when resolveForUser throws', async () => {
    const boom = new Error('Redis down')
    mockResolveForUser.mockRejectedValue(boom)

    const req = buildReq('user-999') as Request
    const res = {} as Response
    const nextFn = buildNextFn()

    await resolvePermissions(req, res, nextFn)

    expect(nextFn).toHaveBeenCalledOnce()
    const [err] = (nextFn as ReturnType<typeof vi.fn>).mock.calls[0] ?? []
    expect(err).toBe(boom) // forwards the original error object
  })

  it('resolves wildcard ["*"] for admin users and writes it to req.user', async () => {
    mockResolveForUser.mockResolvedValue(['*'])

    const req = buildReq('admin-user') as Request
    const res = {} as Response
    const nextFn = buildNextFn()

    await resolvePermissions(req, res, nextFn)

    expect(req.user!.permissions).toEqual(['*'])
    expect(nextFn).toHaveBeenCalledWith()
  })

  it('resolves empty array for users with no roles and writes to req.user', async () => {
    mockResolveForUser.mockResolvedValue([])

    const req = buildReq('no-role-user') as Request
    const res = {} as Response
    const nextFn = buildNextFn()

    await resolvePermissions(req, res, nextFn)

    expect(req.user!.permissions).toEqual([])
    expect(nextFn).toHaveBeenCalledWith()
  })
})
