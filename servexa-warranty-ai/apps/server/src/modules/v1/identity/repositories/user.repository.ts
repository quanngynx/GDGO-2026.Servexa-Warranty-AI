import prisma from '@servexa-warranty-ai/db'
import type { Prisma } from '@servexa-warranty-ai/db/prisma/client'

type UserSelect = Prisma.UserSelect
type UserInclude = Prisma.UserInclude
type UserOptions<TSelect extends UserSelect | undefined, TInclude extends UserInclude | undefined> = {
  select?: TSelect
  include?: TInclude
}

export class UserRepository {
  async findOneByUsername<TSelect extends UserSelect | undefined, TInclude extends UserInclude | undefined>(
    username: string,
    options?: UserOptions<TSelect, TInclude>,
  ) {
    return prisma.user.findUnique({
      where: { username },
      ...options,
    })
  }

  async findOneById<TSelect extends UserSelect | undefined, TInclude extends UserInclude | undefined>(
    id: string,
    options?: UserOptions<TSelect, TInclude>,
  ) {
    return prisma.user.findUnique({
      where: { id },
      ...options,
    })
  }

  async findOneByEmail<TSelect extends UserSelect | undefined, TInclude extends UserInclude | undefined>(
    email: string,
    options?: UserOptions<TSelect, TInclude>,
  ) {
    return prisma.user.findFirst({
      where: {
        OR: [{ companyEmail: email }, { personalEmail: email }],
      },
      ...options,
    })
  }

  async findMany(query: Prisma.UserFindManyArgs) {
    const { take, skip, where, orderBy, ...rest } = query
    return prisma.user.findMany({
      take,
      skip,
      where,
      orderBy,
      ...rest,
    })
  }

  async count(where: Prisma.UserWhereInput) {
    return prisma.user.count({ where })
  }

  async createOne<TSelect extends UserSelect | undefined, TInclude extends UserInclude | undefined>(
    data: Prisma.UserCreateInput,
    options?: UserOptions<TSelect, TInclude>,
  ) {
    return prisma.user.create({
      data,
      ...options,
    })
  }

  async updateOneById<TSelect extends UserSelect | undefined, TInclude extends UserInclude | undefined>(
    id: string,
    data: Prisma.UserUpdateInput,
    options?: UserOptions<TSelect, TInclude>,
  ) {
    return prisma.user.update({
      where: { id },
      data,
      ...options,
    })
  }

  async softDeleteById(id: string) {
    return prisma.user.update({
      where: { id },
      data: { isDelete: true },
    })
  }

  async restoreById(id: string) {
    return prisma.user.update({
      where: { id },
      data: { isDelete: false },
    })
  }
}
