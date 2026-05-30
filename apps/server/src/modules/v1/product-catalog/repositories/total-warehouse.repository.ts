import prisma from '@servexa-warranty-ai/db'
import type { Prisma } from '@servexa-warranty-ai/db/prisma/client'

import type { ITotalWarehouseRepository, TotalWarehouseOptions } from '../interfaces/total-warehouse.interface'

type TotalWarehouseSelect = Prisma.TotalWarehouseSelect
type TotalWarehouseInclude = Prisma.TotalWarehouseInclude

export class TotalWarehouseRepository implements ITotalWarehouseRepository {
  async findAll(query: Prisma.TotalWarehouseFindManyArgs) {
    const { take, skip, where, orderBy, ...rest } = query
    return prisma.totalWarehouse.findMany({
      take,
      skip,
      where,
      orderBy,
      ...rest,
    })
  }

  async count(where: Prisma.TotalWarehouseWhereInput) {
    return prisma.totalWarehouse.count({ where })
  }

  async findOneById<TSelect extends TotalWarehouseSelect | undefined, TInclude extends TotalWarehouseInclude | undefined>(
    id: string,
    options?: TotalWarehouseOptions<TSelect, TInclude>,
  ) {
    return prisma.totalWarehouse.findUnique({
      where: { id },
      ...options,
    })
  }

  async findOneByName<TSelect extends TotalWarehouseSelect | undefined, TInclude extends TotalWarehouseInclude | undefined>(
    name: string,
    options?: TotalWarehouseOptions<TSelect, TInclude>,
  ) {
    return prisma.totalWarehouse.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      ...options,
    })
  }

  async createOne<TSelect extends TotalWarehouseSelect | undefined, TInclude extends TotalWarehouseInclude | undefined>(
    data: Prisma.TotalWarehouseCreateInput,
    options?: TotalWarehouseOptions<TSelect, TInclude>,
  ) {
    return prisma.totalWarehouse.create({
      data,
      ...options,
    })
  }

  async updateOneById<TSelect extends TotalWarehouseSelect | undefined, TInclude extends TotalWarehouseInclude | undefined>(
    id: string,
    data: Prisma.TotalWarehouseUpdateInput,
    options?: TotalWarehouseOptions<TSelect, TInclude>,
  ) {
    return prisma.totalWarehouse.update({
      where: { id },
      data,
      ...options,
    })
  }

  async deleteById(id: string) {
    return prisma.totalWarehouse.delete({
      where: { id },
    })
  }
}
