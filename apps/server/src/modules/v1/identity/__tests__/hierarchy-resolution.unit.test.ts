/**
 * Unit Test: Section 3.1 — Hierarchy Resolution
 *
 * Tests the pure logic of ancestor role resolution based on the
 * fixture closure table, without hitting the DB.
 */
import { describe, it, expect } from 'vitest'

import {
  ROLES,
  ROLE_CLOSURES,
  resolveAncestors,
} from './rbac.fixtures'

// ─── Pure helper under test ───────────────────────────────────────────────────
// resolveAncestors mirrors what PermissionResolverService does:
//   for each assigned role, collect all closure rows where descendantId matches,
//   and return the unique set of ancestorIds.

describe('Hierarchy Resolution — resolveAncestors()', () => {
  it('should include the self-role (depth=0)', () => {
    const result = resolveAncestors([ROLES.STAFF.id])
    expect(result).toContain(ROLES.STAFF.id)
  })

  it('should resolve all ancestors of MANAGER: [MANAGER, ADMIN, SUPER_ADMIN]', () => {
    const result = resolveAncestors([ROLES.MANAGER.id])
    expect(result).toContain(ROLES.MANAGER.id)
    expect(result).toContain(ROLES.ADMIN.id)
    expect(result).toContain(ROLES.SUPER_ADMIN.id)
  })

  it('should resolve all ancestors of STAFF: [STAFF, MANAGER, ADMIN, SUPER_ADMIN]', () => {
    const result = resolveAncestors([ROLES.STAFF.id])
    expect(result).toContain(ROLES.STAFF.id)
    expect(result).toContain(ROLES.MANAGER.id)
    expect(result).toContain(ROLES.ADMIN.id)
    expect(result).toContain(ROLES.SUPER_ADMIN.id)
  })

  it('STAFF should resolve exactly 4 ancestors (no duplicates)', () => {
    const result = resolveAncestors([ROLES.STAFF.id])
    const unique = new Set(result)
    expect(unique.size).toBe(result.length) // no duplicates
    expect(result.length).toBe(4)
  })

  it('ADMIN should resolve ancestors: [ADMIN, SUPER_ADMIN]', () => {
    const result = resolveAncestors([ROLES.ADMIN.id])
    expect(result).toContain(ROLES.ADMIN.id)
    expect(result).toContain(ROLES.SUPER_ADMIN.id)
    expect(result).not.toContain(ROLES.MANAGER.id)
    expect(result).not.toContain(ROLES.STAFF.id)
  })

  it('SUPPORT (no hierarchy) should only resolve itself', () => {
    const result = resolveAncestors([ROLES.SUPPORT.id])
    expect(result).toEqual([ROLES.SUPPORT.id])
  })

  it('should return empty array for unknown role IDs', () => {
    const result = resolveAncestors(['non-existent-role-id'])
    expect(result).toHaveLength(0)
  })

  it('should return empty array for empty input', () => {
    const result = resolveAncestors([])
    expect(result).toHaveLength(0)
  })

  it('should merge ancestors from multiple assigned roles', () => {
    // STAFF roles + SUPPORT: merged ancestor set should contain both paths
    const result = resolveAncestors([ROLES.STAFF.id, ROLES.SUPPORT.id])
    expect(result).toContain(ROLES.STAFF.id)
    expect(result).toContain(ROLES.MANAGER.id)
    expect(result).toContain(ROLES.ADMIN.id)
    expect(result).toContain(ROLES.SUPER_ADMIN.id)
    expect(result).toContain(ROLES.SUPPORT.id)
  })

  it('should deduplicate when multiple assigned roles share the same ancestor', () => {
    // STAFF and MANAGER both have ADMIN and SUPER_ADMIN as ancestors
    const result = resolveAncestors([ROLES.STAFF.id, ROLES.MANAGER.id])
    const adminCount = result.filter((id) => id === ROLES.ADMIN.id).length
    const superAdminCount = result.filter((id) => id === ROLES.SUPER_ADMIN.id).length
    expect(adminCount).toBe(1)
    expect(superAdminCount).toBe(1)
  })

  it('inheritance is one-directional: ADMIN ancestors do NOT include MANAGER or STAFF', () => {
    const result = resolveAncestors([ROLES.ADMIN.id])
    expect(result).not.toContain(ROLES.MANAGER.id)
    expect(result).not.toContain(ROLES.STAFF.id)
  })

  it('ASC_ADMIN inherits from ADMIN and SUPER_ADMIN', () => {
    const result = resolveAncestors([ROLES.ASC_ADMIN.id])
    expect(result).toContain(ROLES.ASC_ADMIN.id)
    expect(result).toContain(ROLES.ADMIN.id)
    expect(result).toContain(ROLES.SUPER_ADMIN.id)
  })

  it('closure table covers the full transitive chain (correct depth entries exist)', () => {
    // Validate that STAFF has a direct closure row to SUPER_ADMIN
    const staffToSuperAdmin = ROLE_CLOSURES.find(
      (c) => c.descendantId === ROLES.STAFF.id && c.ancestorId === ROLES.SUPER_ADMIN.id,
    )
    expect(staffToSuperAdmin).toBeDefined()
    expect(staffToSuperAdmin?.depth).toBe(3)
  })
})
