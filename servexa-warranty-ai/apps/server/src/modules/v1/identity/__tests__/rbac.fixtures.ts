/**
 * Shared RBAC fixtures for all test suites.
 *
 * Hierarchy:
 *   SUPER_ADMIN
 *       ↓
 *     ADMIN
 *       ↓
 *    MANAGER
 *       ↓
 *     STAFF
 *
 * Also includes a SUPPORT role (no hierarchy) for multi-role tests.
 */

export type MockRole = {
  id: string
  name: string
}

export type MockRoleClosure = {
  ancestorId: string
  descendantId: string
  depth: number
}

export type MockRolePermission = {
  roleId: string
  permissionName: string
}

// ─── Roles ───────────────────────────────────────────────────────────────────

export const ROLES = {
  SUPER_ADMIN: { id: 'role-super-admin', name: 'super_admin' },
  ADMIN:       { id: 'role-admin',       name: 'admin' },
  MANAGER:     { id: 'role-manager',     name: 'manager' },
  STAFF:       { id: 'role-staff',       name: 'staff' },
  SUPPORT:     { id: 'role-support',     name: 'support' },
  ASC_ADMIN:   { id: 'role-asc-admin',   name: 'asc_admin' },
} as const

// ─── Closure table entries ────────────────────────────────────────────────────
// Each role has a self-link (depth=0) plus all ancestor links.

export const ROLE_CLOSURES: MockRoleClosure[] = [
  // Self-links
  { ancestorId: ROLES.SUPER_ADMIN.id, descendantId: ROLES.SUPER_ADMIN.id, depth: 0 },
  { ancestorId: ROLES.ADMIN.id,       descendantId: ROLES.ADMIN.id,       depth: 0 },
  { ancestorId: ROLES.MANAGER.id,     descendantId: ROLES.MANAGER.id,     depth: 0 },
  { ancestorId: ROLES.STAFF.id,       descendantId: ROLES.STAFF.id,       depth: 0 },
  { ancestorId: ROLES.SUPPORT.id,     descendantId: ROLES.SUPPORT.id,     depth: 0 },
  { ancestorId: ROLES.ASC_ADMIN.id,   descendantId: ROLES.ASC_ADMIN.id,   depth: 0 },

  // ADMIN is descendant of SUPER_ADMIN (depth=1)
  { ancestorId: ROLES.SUPER_ADMIN.id, descendantId: ROLES.ADMIN.id,       depth: 1 },
  // MANAGER is descendant of ADMIN (depth=1) and SUPER_ADMIN (depth=2)
  { ancestorId: ROLES.ADMIN.id,       descendantId: ROLES.MANAGER.id,     depth: 1 },
  { ancestorId: ROLES.SUPER_ADMIN.id, descendantId: ROLES.MANAGER.id,     depth: 2 },
  // STAFF is descendant of MANAGER (depth=1), ADMIN (depth=2), SUPER_ADMIN (depth=3)
  { ancestorId: ROLES.MANAGER.id,     descendantId: ROLES.STAFF.id,       depth: 1 },
  { ancestorId: ROLES.ADMIN.id,       descendantId: ROLES.STAFF.id,       depth: 2 },
  { ancestorId: ROLES.SUPER_ADMIN.id, descendantId: ROLES.STAFF.id,       depth: 3 },
  // ASC_ADMIN is descendant of ADMIN (depth=1) and SUPER_ADMIN (depth=2)
  { ancestorId: ROLES.ADMIN.id,       descendantId: ROLES.ASC_ADMIN.id,   depth: 1 },
  { ancestorId: ROLES.SUPER_ADMIN.id, descendantId: ROLES.ASC_ADMIN.id,   depth: 2 },
]

// ─── Permissions per role (direct only) ─────────────────────────────────────

export const ROLE_PERMISSIONS: MockRolePermission[] = [
  { roleId: ROLES.ADMIN.id,       permissionName: 'users.read' },
  { roleId: ROLES.ADMIN.id,       permissionName: 'users.write' },
  { roleId: ROLES.MANAGER.id,     permissionName: 'invoice.approve' },
  { roleId: ROLES.SUPPORT.id,     permissionName: 'users.read' },
  { roleId: ROLES.SUPER_ADMIN.id, permissionName: 'admin.super' },
]

// ─── Helper: compute resolved ancestors for a set of role IDs ────────────────

export function resolveAncestors(roleIds: string[]): string[] {
  const resolved = new Set<string>()
  for (const rid of roleIds) {
    for (const closure of ROLE_CLOSURES) {
      if (closure.descendantId === rid) {
        resolved.add(closure.ancestorId)
      }
    }
  }
  return [...resolved]
}

// ─── Helper: compute effective permissions ───────────────────────────────────

export function computeEffectivePermissions(roleIds: string[]): string[] {
  const ancestors = resolveAncestors(roleIds)
  const perms = new Set<string>()
  for (const rp of ROLE_PERMISSIONS) {
    if (ancestors.includes(rp.roleId)) {
      perms.add(rp.permissionName)
    }
  }
  return [...perms]
}
