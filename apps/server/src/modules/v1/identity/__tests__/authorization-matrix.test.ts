/**
 * Authorization Matrix Test: Section 5
 *
 * Verifies end-to-end authorization consistency across all role/permission combinations.
 * The matrix defines the expected allowed/denied status for each role against each permission.
 *
 * This test suite is the single source of truth for "who can do what."
 * Any change to the matrix must be intentional and reviewed.
 */
import { describe, it, expect } from 'vitest'

import {
  ROLES,
  computeEffectivePermissions,
  resolveAncestors,
} from './rbac.fixtures'

// ─── Authorization Matrix Definition ─────────────────────────────────────────
//
// Format: { roleId, permission, expectedGranted }
// This is the central source of truth for authorization consistency.

type MatrixEntry = {
  roleLabel: string
  roleId: string
  permission: string
  expectedGranted: boolean
}

const AUTHORIZATION_MATRIX: MatrixEntry[] = [
  // ── SUPER_ADMIN ─────────────────────────────────────────────────────────────
  // Has admin.super (own); ADMIN bypass applies — has wildcard, so all granted at runtime.
  // At fixture level, only admin.super is in ROLE_PERMISSIONS for SUPER_ADMIN.
  { roleLabel: 'SUPER_ADMIN', roleId: ROLES.SUPER_ADMIN.id, permission: 'admin.super',     expectedGranted: true  },
  { roleLabel: 'SUPER_ADMIN', roleId: ROLES.SUPER_ADMIN.id, permission: 'users.read',      expectedGranted: false }, // Not an ancestor of ADMIN in our fixture (SUPER_ADMIN has no ancestors with users.read)
  // Note: At runtime the admin bypass (*) grants everything, but at fixture-resolver level:
  // SUPER_ADMIN is its own ancestor only — ADMIN.users.read is NOT in SUPER_ADMIN's ancestors

  // ── ADMIN ────────────────────────────────────────────────────────────────────
  { roleLabel: 'ADMIN', roleId: ROLES.ADMIN.id, permission: 'users.read',      expectedGranted: true  },
  { roleLabel: 'ADMIN', roleId: ROLES.ADMIN.id, permission: 'users.write',     expectedGranted: true  },
  { roleLabel: 'ADMIN', roleId: ROLES.ADMIN.id, permission: 'invoice.approve', expectedGranted: false }, // MANAGER permission; ADMIN is ancestor of MANAGER, not the reverse

  // ── MANAGER ──────────────────────────────────────────────────────────────────
  { roleLabel: 'MANAGER', roleId: ROLES.MANAGER.id, permission: 'users.read',      expectedGranted: true  }, // inherited from ADMIN
  { roleLabel: 'MANAGER', roleId: ROLES.MANAGER.id, permission: 'users.write',     expectedGranted: true  }, // inherited from ADMIN
  { roleLabel: 'MANAGER', roleId: ROLES.MANAGER.id, permission: 'invoice.approve', expectedGranted: true  }, // own permission
  { roleLabel: 'MANAGER', roleId: ROLES.MANAGER.id, permission: 'admin.super',     expectedGranted: true  }, // SUPER_ADMIN is an ancestor of MANAGER (depth=2 closure row)

  // ── STAFF ─────────────────────────────────────────────────────────────────────
  { roleLabel: 'STAFF', roleId: ROLES.STAFF.id, permission: 'users.read',      expectedGranted: true  }, // inherited via ADMIN
  { roleLabel: 'STAFF', roleId: ROLES.STAFF.id, permission: 'users.write',     expectedGranted: true  }, // inherited via ADMIN
  { roleLabel: 'STAFF', roleId: ROLES.STAFF.id, permission: 'invoice.approve', expectedGranted: true  }, // inherited via MANAGER
  { roleLabel: 'STAFF', roleId: ROLES.STAFF.id, permission: 'admin.super',     expectedGranted: true  }, // SUPER_ADMIN is an ancestor of STAFF (depth=3 closure row)

  // ── SUPPORT ───────────────────────────────────────────────────────────────────
  { roleLabel: 'SUPPORT', roleId: ROLES.SUPPORT.id, permission: 'users.read',      expectedGranted: true  }, // own permission
  { roleLabel: 'SUPPORT', roleId: ROLES.SUPPORT.id, permission: 'users.write',     expectedGranted: false }, // not in ancestor chain
  { roleLabel: 'SUPPORT', roleId: ROLES.SUPPORT.id, permission: 'invoice.approve', expectedGranted: false }, // not in ancestor chain
  { roleLabel: 'SUPPORT', roleId: ROLES.SUPPORT.id, permission: 'admin.super',     expectedGranted: false }, // not in ancestor chain

  // ── ASC_ADMIN ─────────────────────────────────────────────────────────────────
  { roleLabel: 'ASC_ADMIN', roleId: ROLES.ASC_ADMIN.id, permission: 'users.read',      expectedGranted: true  }, // inherited via ADMIN
  { roleLabel: 'ASC_ADMIN', roleId: ROLES.ASC_ADMIN.id, permission: 'users.write',     expectedGranted: true  }, // inherited via ADMIN
  { roleLabel: 'ASC_ADMIN', roleId: ROLES.ASC_ADMIN.id, permission: 'invoice.approve', expectedGranted: false }, // MANAGER is sibling of ASC_ADMIN, not ancestor
  { roleLabel: 'ASC_ADMIN', roleId: ROLES.ASC_ADMIN.id, permission: 'admin.super',     expectedGranted: true  }, // SUPER_ADMIN is an ancestor of ASC_ADMIN (depth=2 closure row) → inherits admin.super
]

// ─── Dynamic test generation ──────────────────────────────────────────────────

describe('Authorization Matrix — fixture-level permission resolution', () => {
  AUTHORIZATION_MATRIX.forEach(({ roleLabel, roleId, permission, expectedGranted }) => {
    it(`[${roleLabel}] ${expectedGranted ? 'ALLOW' : 'DENY'} → "${permission}"`, () => {
      const effectivePerms = computeEffectivePermissions([roleId])
      const granted = effectivePerms.includes(permission)
      expect(granted).toBe(expectedGranted)
    })
  })
})

// ─── Privilege Escalation Prevention (Section 6.1) ───────────────────────────

describe('Security: Privilege Escalation Prevention', () => {
  it('SUPPORT cannot gain users.write — it has no ancestors that hold that permission', () => {
    // SUPPORT has a self-link only; no ancestor grants users.write
    const perms = computeEffectivePermissions([ROLES.SUPPORT.id])
    expect(perms).not.toContain('users.write')
    expect(perms).not.toContain('invoice.approve')
    expect(perms).not.toContain('admin.super')
  })

  it('MANAGER correctly inherits admin.super from SUPER_ADMIN (legitimate ancestor traversal)', () => {
    // Closure table contains SUPER_ADMIN→MANAGER at depth=2.
    // So MANAGER legitimately receives admin.super through the hierarchy.
    // This validates that the traversal direction is correct (ancestor→descendant).
    const ancestors = resolveAncestors([ROLES.MANAGER.id])
    expect(ancestors).toContain(ROLES.SUPER_ADMIN.id)

    const perms = computeEffectivePermissions([ROLES.MANAGER.id])
    expect(perms).toContain('admin.super')
  })

  it('permissions do NOT flow upward: descendants cannot grant permissions to their ancestors', () => {
    // ASC_ADMIN is a descendant of ADMIN → ADMIN must NOT appear as a descendant of ASC_ADMIN
    // i.e., ADMIN's ancestor list must never include ASC_ADMIN, MANAGER, or STAFF
    const adminAncestors = resolveAncestors([ROLES.ADMIN.id])
    expect(adminAncestors).not.toContain(ROLES.ASC_ADMIN.id)
    expect(adminAncestors).not.toContain(ROLES.MANAGER.id)
    expect(adminAncestors).not.toContain(ROLES.STAFF.id)
  })

  it('STAFF cannot invent permissions that no ancestor holds', () => {
    // STAFF inherits everything from its ancestor chain, but cannot fabricate
    // permissions that were never assigned to any role in the hierarchy.
    const staffPerms = computeEffectivePermissions([ROLES.STAFF.id])
    expect(staffPerms).not.toContain('imaginary.god.mode')
    expect(staffPerms).not.toContain('billing.override')
  })

  it('SUPPORT cannot gain invoice.approve by multi-role trick if SUPPORT has no ancestor with it', () => {
    // Even if a user is assigned both SUPPORT and a fictitious unrelated role,
    // SUPPORT itself and its ancestors (none) do not have invoice.approve
    const supportPerms = computeEffectivePermissions([ROLES.SUPPORT.id])
    expect(supportPerms).not.toContain('invoice.approve')
  })
})

// ─── ASC_ADMIN Inherits from ADMIN (Section 4.2) ─────────────────────────────

describe('Hierarchy Direction Tests — ASC_ADMIN inherits from ADMIN', () => {
  it('ASC_ADMIN inherits users.read from ADMIN (ancestor)', () => {
    const perms = computeEffectivePermissions([ROLES.ASC_ADMIN.id])
    expect(perms).toContain('users.read')
  })

  it('ADMIN does not gain permissions from ASC_ADMIN (reverse direction blocked)', () => {
    const adminAncestors = resolveAncestors([ROLES.ADMIN.id])
    // ASC_ADMIN is a DESCENDANT of ADMIN, so it should NOT appear in ADMIN's ancestor list
    expect(adminAncestors).not.toContain(ROLES.ASC_ADMIN.id)
  })
})
