import prisma from '@/core/infra/prisma'
import { Prisma } from '@/core/infra/prisma/generated/client'

import type {
  IPurchaseLocationRepository,
  PurchaseLocationOptions,
} from '../interfaces/purchase-location-repository.interface'

export class PurchaseLocationRepository implements IPurchaseLocationRepository {
  async findAll(query: Prisma.PurchaseLocationFindManyArgs) {
    const { take, skip, where, orderBy, ...rest } = query
    return prisma.purchaseLocation.findMany({
      take,
      skip,
      where,
      orderBy,
      ...rest,
    })
  }

  async count(where: Prisma.PurchaseLocationWhereInput) {
    return prisma.purchaseLocation.count({ where })
  }

  async findOneById<
    TSelect extends Prisma.PurchaseLocationSelect | undefined,
    TInclude extends Prisma.PurchaseLocationInclude | undefined,
  >(id: string, options?: PurchaseLocationOptions<TSelect, TInclude>) {
    return prisma.purchaseLocation.findUnique({
      where: { id },
      ...options,
    })
  }

  async findOneByCode<
    TSelect extends Prisma.PurchaseLocationSelect | undefined,
    TInclude extends Prisma.PurchaseLocationInclude | undefined,
  >(code: string, options?: PurchaseLocationOptions<TSelect, TInclude>) {
    return prisma.purchaseLocation.findUnique({
      where: { code },
      ...options,
    })
  }

  async findOneByGroupAndCode<
    TSelect extends Prisma.PurchaseLocationSelect | undefined,
    TInclude extends Prisma.PurchaseLocationInclude | undefined,
  >(groupId: string, code: string, options?: PurchaseLocationOptions<TSelect, TInclude>) {
    return prisma.purchaseLocation.findFirst({
      where: { groupId, code },
      ...options,
    })
  }

  async createOne<
    TSelect extends Prisma.PurchaseLocationSelect | undefined,
    TInclude extends Prisma.PurchaseLocationInclude | undefined,
  >(
    data: Prisma.PurchaseLocationCreateInput,
    options?: PurchaseLocationOptions<TSelect, TInclude>,
  ) {
    return prisma.purchaseLocation.create({
      data,
      ...options,
    })
  }

  async updateOneById<
    TSelect extends Prisma.PurchaseLocationSelect | undefined,
    TInclude extends Prisma.PurchaseLocationInclude | undefined,
  >(
    id: string,
    data: Prisma.PurchaseLocationUpdateInput,
    options?: PurchaseLocationOptions<TSelect, TInclude>,
  ) {
    return prisma.purchaseLocation.update({
      where: { id },
      data,
      ...options,
    })
  }

  async deleteById(id: string) {
    return prisma.purchaseLocation.delete({
      where: { id },
    })
  }
}
