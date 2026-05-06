import bcrypt from 'bcrypt'

import prisma from '@servexa-warranty-ai/db'
import type { Prisma } from '@servexa-warranty-ai/db/prisma/client'
import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { createOperationalError } from '@/middlewares/error-middleware'
import { buildPagination } from '../../../../utils/pagination'

import { UserRepository } from '../repositories/user.repository'

const PASSWORD_SALT_ROUNDS = 10

const userSelect = {
  id: true,
  username: true,
  fullName: true,
  companyEmail: true,
  personalEmail: true,
  phone: true,
  avatar: true,
  status: true,
  deletedAt: true,
  createdBy: true,
  updatedBy: true,
  createdAt: true,
  updatedAt: true,
  role: {
    select: {
      id: true,
      name: true,
    },
  },
  ascCenter: {
    select: {
      id: true,
      centerName: true,
    },
  },
  creator: {
    select: {
      username: true,
      fullName: true,
    }
  }
} satisfies Prisma.UserSelect

export type FindAllUsersInput = {
  page: number
  limit: number
  search: string
  sortBy: 'createdAt' | 'updatedAt' | 'username' | 'fullName'
  sortOrder: 'asc' | 'desc'
  status?: 'active' | 'inactive' | 'suspended'
}

export type CreateUserInput = {
  username: string
  fullName: string
  companyEmail?: string
  personalEmail?: string
  phone?: string
  password: string
  avatar?: string
  roleId?: string
  roleName?: string
}

export type UpdateUserInput = {
  fullName?: string
  companyEmail?: string | null
  personalEmail?: string | null
  phone?: string | null
  avatar?: string | null
  status?: 'active' | 'inactive' | 'suspended'
  roleId?: string
  roleName?: string
}

export class UserService {
  private readonly userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  private async resolveRoleId(input: { roleId?: string; roleName?: string }): Promise<string> {
    if (input.roleId) {
      const foundRole = await prisma.role.findUnique({
        where: { id: input.roleId },
        select: { id: true },
      })

      if (!foundRole) {
        throw createOperationalError('Role not found', HTTP_RESPONSE_CODE.BAD_REQUEST)
      }

      return foundRole.id
    }

    if (!input.roleName) {
      throw createOperationalError('Role reference is required', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }

    const foundRole = await prisma.role.findUnique({
      where: { name: input.roleName },
      select: { id: true },
    })

    if (!foundRole) {
      throw createOperationalError('Role not found', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }

    return foundRole.id
  }

  private async ensureEmailNotConflict(
    input: { companyEmail?: string | null; personalEmail?: string | null },
    excludeUserId?: string,
  ) {
    const emailCandidates = [input.companyEmail, input.personalEmail].filter(
      (value): value is string => Boolean(value),
    )

    for (const email of emailCandidates) {
      const foundUser = await this.userRepository.findOneByEmail(email, {
        select: { id: true },
      })

      if (foundUser && foundUser.id !== excludeUserId) {
        throw createOperationalError('Email already exists', HTTP_RESPONSE_CODE.CONFLICT)
      }
    }
  }

  async findAll(query: FindAllUsersInput) {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { username: { contains: query.search, mode: 'insensitive' } },
              { fullName: { contains: query.search, mode: 'insensitive' } },
              { phone: { contains: query.search, mode: 'insensitive' } },
              { companyEmail: { contains: query.search, mode: 'insensitive' } },
              { personalEmail: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    }

    const [items, total] = await Promise.all([
      this.userRepository.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
        select: userSelect,
      }),
      this.userRepository.count(where),
    ])

    return {
      items,
      pagination: buildPagination(query.page, query.limit, total),
    }
  }

  async findOneById(userId: string) {
    const foundUser = await this.userRepository.findOneById(userId, {
      select: userSelect,
    })

    if (!foundUser || foundUser.deletedAt) {
      throw createOperationalError('User not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    return foundUser
  }

  async createUser(input: CreateUserInput) {
    const foundUsername = await this.userRepository.findOneByUsername(input.username, {
      select: { id: true },
    })
    if (foundUsername) {
      throw createOperationalError('Username already exists', HTTP_RESPONSE_CODE.CONFLICT)
    }

    await this.ensureEmailNotConflict({
      companyEmail: input.companyEmail,
      personalEmail: input.personalEmail,
    })

    const roleId = await this.resolveRoleId({
      roleId: input.roleId,
      roleName: input.roleName,
    })

    const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS)

    return this.userRepository.createOne(
      {
        username: input.username,
        fullName: input.fullName,
        companyEmail: input.companyEmail,
        personalEmail: input.personalEmail,
        phone: input.phone,
        password: passwordHash,
        avatar: input.avatar,
        role: {
          connect: { id: roleId },
        },
      },
      { select: userSelect },
    )
  }

  async updateUser(userId: string, input: UpdateUserInput) {
    const existingUser = await this.userRepository.findOneById(userId, {
      select: { id: true, deletedAt: true },
    })

    if (!existingUser || existingUser.deletedAt) {
      throw createOperationalError('User not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    await this.ensureEmailNotConflict(
      {
        companyEmail: input.companyEmail,
        personalEmail: input.personalEmail,
      },
      userId,
    )

    const roleId = input.roleId || input.roleName
      ? await this.resolveRoleId({ roleId: input.roleId, roleName: input.roleName })
      : undefined

    return this.userRepository.updateOneById(
      userId,
      {
        fullName: input.fullName,
        companyEmail: input.companyEmail,
        personalEmail: input.personalEmail,
        phone: input.phone,
        avatar: input.avatar,
        status: input.status,
        ...(roleId
          ? {
              role: {
                connect: { id: roleId },
              },
            }
          : {}),
      },
      { select: userSelect },
    )
  }

  async deleteUser(userId: string) {
    const existingUser = await this.userRepository.findOneById(userId, {
      select: { id: true, deletedAt: true },
    })

    if (!existingUser || existingUser.deletedAt) {
      throw createOperationalError('User not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    await this.userRepository.softDeleteById(userId)

    return { success: true }
  }

  async restoreUser(userId: string) {
    const existingUser = await this.userRepository.findOneById(userId, {
      select: { id: true },
    })

    if (!existingUser) {
      throw createOperationalError('User not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    return this.userRepository.restoreById(userId)
  }
}
