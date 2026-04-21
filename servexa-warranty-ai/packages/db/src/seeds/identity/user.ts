import bcrypt from 'bcrypt'

import prisma from '../..'

export type SeedRoleMode = 'use-existing-role' | 'create-role-if-missing'

export type SeedIdentityUserOptions = {
  username: string
  password: string
  fullName: string
  email: string
  roleName: string
  roleDescription: string
  roleMode: SeedRoleMode
}

const defaultOptions: SeedIdentityUserOptions = {
  username: 'admin',
  password: 'Admin@123',
  fullName: 'System Administrator',
  email: 'admin@servexa-warranty-ai.com',
  roleName: 'admin',
  roleDescription: 'System administrator role',
  roleMode: 'use-existing-role',
}

const resolveRole = async (options: Pick<SeedIdentityUserOptions, 'roleName' | 'roleDescription' | 'roleMode'>) => {
  const foundRole = await prisma.role.findUnique({
    where: { name: options.roleName },
    select: {
      id: true,
      name: true,
    },
  })

  if (foundRole) {
    return foundRole
  }

  if (options.roleMode === 'use-existing-role') {
    throw new Error(
      `Role "${options.roleName}" was not found. Either pre-seed this role or use roleMode="create-role-if-missing".`,
    )
  }

  return prisma.role.create({
    data: {
      name: options.roleName,
      description: options.roleDescription,
    },
    select: {
      id: true,
      name: true,
    },
  })
}

export const seedIdentityUser = async (
  inputOptions: Partial<SeedIdentityUserOptions> = {},
) => {
  const options = {
    ...defaultOptions,
    ...inputOptions,
  }

  const role = await resolveRole({
    roleName: options.roleName,
    roleDescription: options.roleDescription,
    roleMode: options.roleMode,
  })

  const passwordHash = await bcrypt.hash(options.password, 10)

  const user = await prisma.user.upsert({
    where: { username: options.username },
    update: {
      fullName: options.fullName,
      companyEmail: options.email,
      password: passwordHash,
      roleId: role.id,
      deletedAt: null,
      status: 'active',
    },
    create: {
      username: options.username,
      fullName: options.fullName,
      companyEmail: options.email,
      password: passwordHash,
      roleId: role.id,
      status: 'active',
      deletedAt: null,
    },
    select: {
      id: true,
      username: true,
      fullName: true,
      companyEmail: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  return {
    user,
    roleMode: options.roleMode,
  }
}
