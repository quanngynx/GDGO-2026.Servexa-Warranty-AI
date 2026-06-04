import prisma from '@/core/infra/prisma'
import { Prisma } from '@/core/infra/prisma/generated/client'

import type { IAscCenterRepository, AscCenterOptions } from '../interfaces/asc-center.interface'

type AscCenterSelect = Prisma.AscCenterSelect
type AscCenterInclude = Prisma.AscCenterInclude

export class AscCenterRepository implements IAscCenterRepository {
  async findAll(query: Prisma.AscCenterFindManyArgs) {
    const { take, skip, where, orderBy, ...rest } = query
    return prisma.ascCenter.findMany({
      take,
      skip,
      where,
      orderBy,
      ...rest,
    })
  }

  async count(where: Prisma.AscCenterWhereInput) {
    return prisma.ascCenter.count({ where })
  }

  async findOneById<TSelect extends AscCenterSelect | undefined, TInclude extends AscCenterInclude | undefined>(
    id: string,
    options?: AscCenterOptions<TSelect, TInclude>,
  ) {
    return prisma.ascCenter.findUnique({
      where: { id },
      ...options,
    })
  }

  async findOneByCenterCode<TSelect extends AscCenterSelect | undefined, TInclude extends AscCenterInclude | undefined>(
    centerCode: string,
    options?: AscCenterOptions<TSelect, TInclude>,
  ) {
    return prisma.ascCenter.findUnique({
      where: { centerCode },
      ...options,
    })
  }

  async createOne<TSelect extends AscCenterSelect | undefined, TInclude extends AscCenterInclude | undefined>(
    data: Prisma.AscCenterCreateInput,
    options?: AscCenterOptions<TSelect, TInclude>,
  ) {
    return prisma.ascCenter.create({
      data,
      ...options,
    })
  }

  async updateOneById<TSelect extends AscCenterSelect | undefined, TInclude extends AscCenterInclude | undefined>(
    id: string,
    data: Prisma.AscCenterUpdateInput,
    options?: AscCenterOptions<TSelect, TInclude>,
  ) {
    return prisma.ascCenter.update({
      where: { id },
      data,
      ...options,
    })
  }

  async deleteById(id: string) {
    return prisma.ascCenter.delete({
      where: { id },
    })
  }
}
