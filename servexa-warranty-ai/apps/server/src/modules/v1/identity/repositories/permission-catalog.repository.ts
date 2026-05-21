import prisma from '@servexa-warranty-ai/db'
import type { Prisma } from '@servexa-warranty-ai/db/prisma/client'

export class PermissionCatalogRepository {
  async findAll(query: Prisma.PermissionFindManyArgs) {
    const { take, skip, where, orderBy, ...rest } = query
    return prisma.permission.findMany({
      take,
      skip,
      where,
      orderBy,
      ...rest,
    })
  }

  async count(where: Prisma.PermissionWhereInput) {
    return prisma.permission.count({ where })
  }

  async findOneById(id: string, select?: Prisma.PermissionSelect) {
    return prisma.permission.findUnique({
      where: { id },
      ...(select ? { select } : {}),
    })
  }

  async findOneByName(name: string, select?: Prisma.PermissionSelect) {
    return prisma.permission.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      ...(select ? { select } : {}),
    })
  }

  async createOne(data: Prisma.PermissionCreateInput, select?: Prisma.PermissionSelect) {
    return prisma.permission.create({
      data,
      ...(select ? { select } : {}),
    })
  }

  async updateOneById(
    id: string,
    data: Prisma.PermissionUpdateInput,
    select?: Prisma.PermissionSelect,
  ) {
    return prisma.permission.update({
      where: { id },
      data,
      ...(select ? { select } : {}),
    })
  }

  async deleteById(id: string) {
    return prisma.permission.delete({
      where: { id },
    })
  }
}
