/**
 * Unit Test: Section 3.3 — requirePermissions Middleware
 *
 * Tests ALL/ANY semantics, wildcard bypass, empty arrays,
 * and missing permissions behavior — with pure mocks,
 * no DB or Redis involved.
 */
import { describe, it, expect, vi } from 'vitest'
import type { Request, Response, NextFunction } from 'express'

// ─── We import only the pure middleware factory ─────────────────────────────
// resolvePermissions is also in the same file but is integration-level.
// We only unit-test requirePermissions here.
import { requirePermissions } from '@/middlewares/require-permission.middleware'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildReq(permissions: string[]): Partial<Request> {
  return {
    user: {
      id: 'user-1',
      email: 'test@test.com',
      username: 'tester',
      fullName: 'Tester',
      role: 'staff' as never,
      roleScope: 'system' as never,
      permissions,
      aud: 'access:common',
    },
  }
}

function buildMocks() {
  const res = {} as Response
  const next = vi.fn() as unknown as NextFunction
  return { res, next }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('requirePermissions middleware — mode: all (default)', () => {
  it('allows when user has all required permissions', () => {
    const req = buildReq(['users.read', 'users.write'])
    const { res, next } = buildMocks()

    requirePermissions(['users.read', 'users.write'])(req as Request, res, next)

    expect(next).toHaveBeenCalledOnce()
    expect(next).toHaveBeenCalledWith() // no error arg = success
  })

  it('denies when user is missing one required permission', () => {
    const req = buildReq(['users.read'])
    const { res, next } = buildMocks()

    requirePermissions(['users.read', 'users.write'])(req as Request, res, next)

    expect(next).toHaveBeenCalledOnce()
    const [err] = (next as ReturnType<typeof vi.fn>).mock.calls[0] ?? []
    expect(err).toBeDefined()
    expect(err.statusCode).toBe(403)
  })

  it('denies when user has no permissions at all', () => {
    const req = buildReq([])
    const { res, next } = buildMocks()

    requirePermissions(['users.read'])(req as Request, res, next)

    expect(next).toHaveBeenCalledOnce()
    const [err] = (next as ReturnType<typeof vi.fn>).mock.calls[0] ?? []
    expect(err.statusCode).toBe(403)
  })

  it('allows single required permission when user has it', () => {
    const req = buildReq(['invoice.approve'])
    const { res, next } = buildMocks()

    requirePermissions(['invoice.approve'])(req as Request, res, next)

    expect(next).toHaveBeenCalledWith()
  })
})

describe('requirePermissions middleware — mode: any', () => {
  it('allows when user has at least one of the required permissions', () => {
    const req = buildReq(['admin.super'])
    const { res, next } = buildMocks()

    requirePermissions(['admin.super', 'invoice.override'], { mode: 'any' })(
      req as Request, res, next,
    )

    expect(next).toHaveBeenCalledWith()
  })

  it('allows with the second of two required permissions', () => {
    const req = buildReq(['invoice.override'])
    const { res, next } = buildMocks()

    requirePermissions(['admin.super', 'invoice.override'], { mode: 'any' })(
      req as Request, res, next,
    )

    expect(next).toHaveBeenCalledWith()
  })

  it('denies when user has none of the allowed permissions', () => {
    const req = buildReq(['users.read'])
    const { res, next } = buildMocks()

    requirePermissions(['admin.super', 'invoice.override'], { mode: 'any' })(
      req as Request, res, next,
    )

    expect(next).toHaveBeenCalledOnce()
    const [err] = (next as ReturnType<typeof vi.fn>).mock.calls[0] ?? []
    expect(err.statusCode).toBe(403)
  })
})

describe('requirePermissions middleware — wildcard bypass', () => {
  it('allows any request when user has wildcard (*) permission', () => {
    const req = buildReq(['*'])
    const { res, next } = buildMocks()

    requirePermissions(['admin.super', 'invoice.override'])(req as Request, res, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('wildcard bypasses even with restrictive all-mode requirement', () => {
    const req = buildReq(['*'])
    const { res, next } = buildMocks()

    requirePermissions(['a.b', 'c.d', 'e.f'])(req as Request, res, next)

    expect(next).toHaveBeenCalledWith()
  })
})

describe('requirePermissions middleware — edge cases', () => {
  it('returns 401 when req.user is undefined (not authenticated)', () => {
    const req = { user: undefined } as unknown as Request
    const { res, next } = buildMocks()

    requirePermissions(['users.read'])(req, res, next)

    expect(next).toHaveBeenCalledOnce()
    const [err] = (next as ReturnType<typeof vi.fn>).mock.calls[0] ?? []
    expect(err).toBeDefined()
    // Should be 401 Unauthorized (not 403 — user is not even identified)
    expect(err.statusCode).toBe(401)
  })

  it('does not leak specific permission names in the error response', () => {
    const req = buildReq(['users.read'])
    const { res, next } = buildMocks()

    requirePermissions(['admin.secret.permission'])(req as Request, res, next)

    const [err] = (next as ReturnType<typeof vi.fn>).mock.calls[0] ?? []
    // Error message must not expose the required permission name
    expect(err.message).not.toContain('admin.secret.permission')
  })
})
