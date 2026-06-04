import prisma from '../../../src/core/infra/prisma'

/** Core API permissions for v1 route guards (see route-permissions.ts). */
export const API_PERMISSIONS = [
  { name: 'users.read', description: 'List and view users' },
  { name: 'users.write', description: 'Create and update users' },
  { name: 'users.delete', description: 'Soft-delete users' },
  { name: 'users.restore', description: 'Restore deleted users' },
  { name: 'roles.read', description: 'List and view roles' },
  { name: 'roles.write', description: 'Create and manage role hierarchy' },
  { name: 'permissions.read', description: 'List permission catalog' },
  { name: 'permissions.write', description: 'Manage permission catalog' },
  { name: 'repair_case.read', description: 'View repair cases' },
  { name: 'repair_case.write', description: 'Create repair cases' },
  { name: 'repair_case.update', description: 'Update repair cases' },
  { name: 'customer_response.create', description: 'Approve customer response HITL drafts' },
  { name: 'payment.read', description: 'View payments' },
  { name: 'payment.write', description: 'Manage payments' },
  { name: 'asc_center.read', description: 'View ASC centers' },
  { name: 'asc_center.write', description: 'Manage ASC centers' },
  { name: 'accessory_request.read', description: 'View accessory requests' },
  { name: 'accessory_request.write', description: 'Manage accessory requests' },
  { name: 'stocktake.read', description: 'View stocktakes' },
  { name: 'stocktake.write', description: 'Manage stocktakes' },
  { name: 'voucher.read', description: 'View vouchers' },
  { name: 'voucher.write', description: 'Manage vouchers' },
  { name: 'catalog.read', description: 'View product catalog' },
  { name: 'catalog.write', description: 'Manage product catalog' },
  { name: 'catalog.import', description: 'Import catalog data' },
  { name: 'catalog.export', description: 'Export catalog data' },
  { name: 'document.read', description: 'View documents' },
  { name: 'document.write', description: 'Create and update documents' },
  { name: 'document.delete', description: 'Delete documents' },
] as const

const ROLES_WITH_FULL_API = ['admin', 'super_admin', 'asc_admin', 'asc_manager'] as const

const ASC_READ_PERMISSIONS = [
  'repair_case.read',
  'repair_case.write',
  'repair_case.update',
  'payment.read',
  'payment.write',
  'asc_center.read',
  'accessory_request.read',
  'accessory_request.write',
  'stocktake.read',
  'stocktake.write',
  'voucher.read',
  'voucher.write',
  'catalog.read',
  'document.read',
  'document.write',
] as const

export async function seedApiPermissions() {
  const permissionIds = new Map<string, string>()

  for (const perm of API_PERMISSIONS) {
    const row = await prisma.permission.upsert({
      where: { name: perm.name },
      create: { name: perm.name, description: perm.description },
      update: { description: perm.description },
    })
    permissionIds.set(perm.name, row.id)
  }

  const attached: { role: string; permission: string }[] = []

  for (const roleName of ROLES_WITH_FULL_API) {
    const role = await prisma.role.findUnique({ where: { name: roleName } })
    if (!role) continue

    const names =
      roleName === 'asc_admin' || roleName === 'asc_manager'
        ? [...ASC_READ_PERMISSIONS]
        : API_PERMISSIONS.map((p) => p.name)

    for (const permName of names) {
      const permissionId = permissionIds.get(permName)
      if (!permissionId) continue

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: role.id, permissionId },
        },
        create: { roleId: role.id, permissionId },
        update: {},
      })
      attached.push({ role: roleName, permission: permName })
    }
  }

  return { permissions: API_PERMISSIONS.map((p) => p.name), attached }
}
