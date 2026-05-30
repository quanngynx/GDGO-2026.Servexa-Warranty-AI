import prisma from '../..'

const HITL_PERMISSIONS = [
  {
    name: 'repair_case.update',
    description: 'Approve repair escalation HITL actions',
  },
  {
    name: 'repair_case.assign',
    description: 'Approve technician assignment HITL actions',
  },
  {
    name: 'customer_response.create',
    description: 'Approve customer response draft HITL actions',
  },
] as const

/** Roles that may supervise HITL decisions (dual approver model). */
const APPROVER_ROLE_NAMES = [
  'admin',
  'company_admin',
  'asc_admin',
  'asc_manager',
  'asc_coordinator',
] as const

export const seedHitlPermissions = async () => {
  const permissionIds: string[] = []

  for (const perm of HITL_PERMISSIONS) {
    const row = await prisma.permission.upsert({
      where: { name: perm.name },
      create: { name: perm.name, description: perm.description },
      update: { description: perm.description },
      select: { id: true, name: true },
    })
    permissionIds.push(row.id)
  }

  const attached: { role: string; permission: string }[] = []

  for (const roleName of APPROVER_ROLE_NAMES) {
    const role = await prisma.role.findUnique({
      where: { name: roleName },
      select: { id: true, name: true },
    })
    if (!role) continue

    for (const perm of HITL_PERMISSIONS) {
      const permission = await prisma.permission.findUnique({
        where: { name: perm.name },
        select: { id: true },
      })
      if (!permission) continue

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
        update: {},
      })
      attached.push({ role: roleName, permission: perm.name })
    }
  }

  return { permissions: HITL_PERMISSIONS.map((p) => p.name), attached }
}
