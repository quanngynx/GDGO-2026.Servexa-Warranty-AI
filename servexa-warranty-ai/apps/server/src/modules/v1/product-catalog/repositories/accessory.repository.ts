import prisma from '@servexa-warranty-ai/db'
import type { Prisma } from '@servexa-warranty-ai/db/prisma/client'

type AccessorySelect = Prisma.AccessorySelect
type AccessoryInclude = Prisma.AccessoryInclude

type AccessoryOptions<TSelect extends AccessorySelect | undefined, TInclude extends AccessoryInclude | undefined> =
  TSelect extends AccessorySelect
    ? { select: TSelect; include?: never }
    : TInclude extends AccessoryInclude
      ? { include: TInclude; select?: never }
      : { select?: undefined; include?: undefined }

export class AccessoryRepository {
  async findMany(query: Prisma.AccessoryFindManyArgs) {
    const { take, skip, where, orderBy, ...rest } = query
    return prisma.accessory.findMany({
      take,
      skip,
      where,
      orderBy,
      ...rest,
    })
  }

  async count(where: Prisma.AccessoryWhereInput) {
    return prisma.accessory.count({ where })
  }

  async findOneById<TSelect extends AccessorySelect | undefined, TInclude extends AccessoryInclude | undefined>(
    id: string,
    options?: AccessoryOptions<TSelect, TInclude>,
  ) {
    return prisma.accessory.findUnique({
      where: { id },
      ...options,
    })
  }

  async findOneByPartNumber<TSelect extends AccessorySelect | undefined, TInclude extends AccessoryInclude | undefined>(
    partNumber: string,
    options?: AccessoryOptions<TSelect, TInclude>,
  ) {
    return prisma.accessory.findFirst({
      where: { partNumber: { equals: partNumber, mode: 'insensitive' } },
      ...options,
    })
  }

  async createOne<TSelect extends AccessorySelect | undefined, TInclude extends AccessoryInclude | undefined>(
    data: Prisma.AccessoryCreateInput,
    options?: AccessoryOptions<TSelect, TInclude>,
  ) {
    return prisma.accessory.create({
      data,
      ...options,
    })
  }

  async updateOneById<TSelect extends AccessorySelect | undefined, TInclude extends AccessoryInclude | undefined>(
    id: string,
    data: Prisma.AccessoryUpdateInput,
    options?: AccessoryOptions<TSelect, TInclude>,
  ) {
    return prisma.accessory.update({
      where: { id },
      data,
      ...options,
    })
  }

  async deleteById(id: string) {
    return prisma.accessory.delete({
      where: { id },
    })
  }

  async findManyTotalWarehouseStock(query: Prisma.TotalWarehouseStockFindManyArgs) {
    return prisma.totalWarehouseStock.findMany(query)
  }

  async findTotalWarehouseByName(name: string) {
    return prisma.totalWarehouse.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      select: { id: true, name: true },
    })
  }

  async countTotalWarehouseStock(where: Prisma.TotalWarehouseStockWhereInput) {
    return prisma.totalWarehouseStock.count({ where })
  }

  async findOneTotalWarehouseStock(
    totalWarehouseId: string,
    accessoryId: string,
    args?: Omit<Prisma.TotalWarehouseStockFindUniqueArgs, 'where'>,
  ) {
    return prisma.totalWarehouseStock.findUnique({
      where: {
        totalWarehouseId_accessoryId: {
          totalWarehouseId,
          accessoryId,
        },
      },
      ...args,
    })
  }

  async createTotalWarehouseStock(
    data: Prisma.TotalWarehouseStockUncheckedCreateInput,
    args?: Omit<Prisma.TotalWarehouseStockCreateArgs, 'data'>,
  ) {
    return prisma.totalWarehouseStock.create({
      data,
      ...args,
    })
  }

  async updateTotalWarehouseStock(
    totalWarehouseId: string,
    accessoryId: string,
    data: Prisma.TotalWarehouseStockUpdateInput,
    args?: Omit<Prisma.TotalWarehouseStockUpdateArgs, 'where' | 'data'>,
  ) {
    return prisma.totalWarehouseStock.update({
      where: {
        totalWarehouseId_accessoryId: {
          totalWarehouseId,
          accessoryId,
        },
      },
      data,
      ...args,
    })
  }

  async deleteTotalWarehouseStock(totalWarehouseId: string, accessoryId: string) {
    return prisma.totalWarehouseStock.delete({
      where: {
        totalWarehouseId_accessoryId: {
          totalWarehouseId,
          accessoryId,
        },
      },
    })
  }

  async findManyAscAccessoryStock(query: Prisma.AscAccessoryStockFindManyArgs) {
    return prisma.ascAccessoryStock.findMany(query)
  }

  async countAscAccessoryStock(where: Prisma.AscAccessoryStockWhereInput) {
    return prisma.ascAccessoryStock.count({ where })
  }

  async findOneAscAccessoryStock(
    ascCenterId: string,
    accessoryId: string,
    args?: Omit<Prisma.AscAccessoryStockFindUniqueArgs, 'where'>,
  ) {
    return prisma.ascAccessoryStock.findUnique({
      where: {
        ascCenterId_accessoryId: {
          ascCenterId,
          accessoryId,
        },
      },
      ...args,
    })
  }

  async createAscAccessoryStock(
    data: Prisma.AscAccessoryStockUncheckedCreateInput,
    args?: Omit<Prisma.AscAccessoryStockCreateArgs, 'data'>,
  ) {
    return prisma.ascAccessoryStock.create({
      data,
      ...args,
    })
  }

  async updateAscAccessoryStock(
    ascCenterId: string,
    accessoryId: string,
    data: Prisma.AscAccessoryStockUpdateInput,
    args?: Omit<Prisma.AscAccessoryStockUpdateArgs, 'where' | 'data'>,
  ) {
    return prisma.ascAccessoryStock.update({
      where: {
        ascCenterId_accessoryId: {
          ascCenterId,
          accessoryId,
        },
      },
      data,
      ...args,
    })
  }

  async deleteAscAccessoryStock(ascCenterId: string, accessoryId: string) {
    return prisma.ascAccessoryStock.delete({
      where: {
        ascCenterId_accessoryId: {
          ascCenterId,
          accessoryId,
        },
      },
    })
  }
}
