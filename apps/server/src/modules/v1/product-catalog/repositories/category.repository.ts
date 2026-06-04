import prisma from '@/core/infra/prisma'
import { Prisma } from '@/core/infra/prisma/generated/client'

import type { CategoryOptions, ICategoryRepository } from '../interfaces/category-repository.interface'

type CategorySelect = Prisma.CategorySelect
type CategoryInclude = Prisma.CategoryInclude

export class CategoryRepository implements ICategoryRepository {
  async findAll(query: Prisma.CategoryFindManyArgs) {
    const { take, skip, where, orderBy, ...rest } = query
    return prisma.category.findMany({
      take,
      skip,
      where,
      orderBy,
      ...rest,
    })
  }

  async count(where: Prisma.CategoryWhereInput) {
    return prisma.category.count({ where })
  }

  async findOneById<TSelect extends CategorySelect | undefined, TInclude extends CategoryInclude | undefined>(
    id: string,
    options?: CategoryOptions<TSelect, TInclude>,
  ) {
    return prisma.category.findUnique({
      where: { id },
      ...options,
    })
  }

  async findOneByName<TSelect extends CategorySelect | undefined, TInclude extends CategoryInclude | undefined>(
    name: string,
    options?: CategoryOptions<TSelect, TInclude>,
  ) {
    return prisma.category.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      ...options,
    })
  }

  async createOne<TSelect extends CategorySelect | undefined, TInclude extends CategoryInclude | undefined>(
    data: Prisma.CategoryCreateInput,
    options?: CategoryOptions<TSelect, TInclude>,
  ) {
    return prisma.category.create({
      data,
      ...options,
    })
  }

  async updateOneById<TSelect extends CategorySelect | undefined, TInclude extends CategoryInclude | undefined>(
    id: string,
    data: Prisma.CategoryUpdateInput,
    options?: CategoryOptions<TSelect, TInclude>,
  ) {
    return prisma.category.update({
      where: { id },
      data,
      ...options,
    })
  }

  async deleteById(id: string) {
    return prisma.category.delete({
      where: { id },
    })
  }
}
