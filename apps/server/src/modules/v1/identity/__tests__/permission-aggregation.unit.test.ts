/**
 * Unit Test: Section 3.2 — Permission Aggregation
 *
 * Tests that effective permissions are correctly merged and deduplicated
 * across inherited role trees, using pure fixture helpers only.
 */
import { describe, it, expect } from 'vitest'

import {
  ROLES,
  ROLE_PERMISSIONS,
  computeEffectivePermissions,
} from './rbac.fixtures'

describe('Permission Aggregation — computeEffectivePermissions()', () => {
  it('ADMIN directly has [users.read, users.write]', () => {
    const perms = computeEffectivePermissions([ROLES.ADMIN.id])
    expect(perms).toContain('users.read')
    expect(perms).toContain('users.write')
  })

  it('MANAGER inherits users.read and users.write from ADMIN (ancestor)', () => {
    const perms = computeEffectivePermissions([ROLES.MANAGER.id])
    expect(perms).toContain('users.read')
    expect(perms).toContain('users.write')
    expect(perms).toContain('invoice.approve') // own permission
  })

  it('STAFF inherits all ancestor permissions: users.read, users.write, invoice.approve', () => {
    const perms = computeEffectivePermissions([ROLES.STAFF.id])
    expect(perms).toContain('users.read')
    expect(perms).toContain('users.write')
    expect(perms).toContain('invoice.approve')
  })

  it('SUPER_ADMIN has admin.super (own) plus inherits nothing extra from ancestors', () => {
    const perms = computeEffectivePermissions([ROLES.SUPER_ADMIN.id])
    expect(perms).toContain('admin.super')
    // SUPER_ADMIN owns itself and has no ancestor above it
    expect(perms).not.toContain('users.read')
    expect(perms).not.toContain('invoice.approve')
  })

  it('SUPPORT has only users.read (own, no hierarchy)', () => {
    const perms = computeEffectivePermissions([ROLES.SUPPORT.id])
    expect(perms).toEqual(['users.read'])
  })

  it('empty role list returns empty permissions', () => {
    const perms = computeEffectivePermissions([])
    expect(perms).toHaveLength(0)
  })

  it('permissions are deduplicated when same permission appears across roles', () => {
    // SUPPORT and ADMIN both have users.read — merged result should not duplicate it
    const perms = computeEffectivePermissions([ROLES.ADMIN.id, ROLES.SUPPORT.id])
    const usersReadCount = perms.filter((p) => p === 'users.read').length
    expect(usersReadCount).toBe(1)
  })

  it('multiple assigned roles merge permissions correctly', () => {
    // STAFF + SUPPORT: STAFF inherits users.read,write,invoice.approve; SUPPORT adds users.read (deduplicated)
    const perms = computeEffectivePermissions([ROLES.STAFF.id, ROLES.SUPPORT.id])
    expect(perms).toContain('users.read')
    expect(perms).toContain('users.write')
    expect(perms).toContain('invoice.approve')
    // Confirm no duplicates
    const unique = new Set(perms)
    expect(unique.size).toBe(perms.length)
  })

  it('ASC_ADMIN (inherits ADMIN) has users.read and users.write', () => {
    const perms = computeEffectivePermissions([ROLES.ASC_ADMIN.id])
    expect(perms).toContain('users.read')
    expect(perms).toContain('users.write')
    // Should NOT have invoice.approve (that belongs to MANAGER, which is a sibling, not an ancestor of ASC_ADMIN)
    expect(perms).not.toContain('invoice.approve')
  })

  it('ROLE_PERMISSIONS fixture has correct role-permission count', () => {
    // Sanity check: 5 entries across roles in the fixture
    expect(ROLE_PERMISSIONS.length).toBe(5)
  })
})
