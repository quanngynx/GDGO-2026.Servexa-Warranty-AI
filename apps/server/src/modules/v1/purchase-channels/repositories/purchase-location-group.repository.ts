import prisma from '@/core/infra/prisma'
import { Prisma } from '@/core/infra/prisma/generated/client'

import type {
  IPurchaseLocationGroupRepository,
  PurchaseLocationGroupOptions,
} from '../interfaces/purchase-location-group-repository.interface'

export class PurchaseLocationGroupRepository implements IPurchaseLocationGroupRepository {
  async findAll(query: Prisma.PurchaseLocationGroupFindManyArgs) {
    const { take, skip, where, orderBy, ...rest } = query
    return prisma.purchaseLocationGroup.findMany({
      take,
      skip,
      where,
      orderBy,
      ...rest,
    })
  }

  async count(where: Prisma.PurchaseLocationGroupWhereInput) {
    return prisma.purchaseLocationGroup.count({ where })
  }

  async findOneById<
    TSelect extends Prisma.PurchaseLocationGroupSelect | undefined,
    TInclude extends Prisma.PurchaseLocationGroupInclude | undefined,
  >(id: string, options?: PurchaseLocationGroupOptions<TSelect, TInclude>) {
    return prisma.purchaseLocationGroup.findUnique({
      where: { id },
      ...options,
    })
  }

  async findOneByCode<
    TSelect extends Prisma.PurchaseLocationGroupSelect | undefined,
    TInclude extends Prisma.PurchaseLocationGroupInclude | undefined,
  >(code: string, options?: PurchaseLocationGroupOptions<TSelect, TInclude>) {
    return prisma.purchaseLocationGroup.findUnique({
      where: { code },
      ...options,
    })
  }

  async createOne<
    TSelect extends Prisma.PurchaseLocationGroupSelect | undefined,
    TInclude extends Prisma.PurchaseLocationGroupInclude | undefined,
  >(
    data: Prisma.PurchaseLocationGroupCreateInput,
    options?: PurchaseLocationGroupOptions<TSelect, TInclude>,
  ) {
    return prisma.purchaseLocationGroup.create({
      data,
      ...options,
    })
  }

  async updateOneById<
    TSelect extends Prisma.PurchaseLocationGroupSelect | undefined,
    TInclude extends Prisma.PurchaseLocationGroupInclude | undefined,
  >(
    id: string,
    data: Prisma.PurchaseLocationGroupUpdateInput,
    options?: PurchaseLocationGroupOptions<TSelect, TInclude>,
  ) {
    return prisma.purchaseLocationGroup.update({
      where: { id },
      data,
      ...options,
    })
  }

  async deleteById(id: string) {
    return prisma.purchaseLocationGroup.delete({
      where: { id },
    })
  }
}
