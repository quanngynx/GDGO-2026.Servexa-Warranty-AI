import prisma from '@servexa-warranty-ai/db';
import { Prisma } from '@servexa-warranty-ai/db/prisma/client';

import type { IAscStocktakeRepository } from '../interfaces/asc-stocktake-repository.interface';
import type {
  FindAllAscStocktakesInput,
  FindStocktakeAccessoriesInput,
  FindStocktakeStockLevelsInput,
} from '../dtos/asc-stocktake.dto';

export const ascStocktakeListSelect = {
  id: true,
  ascCenterId: true,
  notes: true,
  createdBy: true,
  createdAt: true,
  ascCenter: { select: { id: true, centerName: true, centerCode: true } },
  creator: { select: { id: true, fullName: true, companyEmail: true } },
  _count: { select: { items: true } },
} satisfies Prisma.AscStocktakeSelect;

export const ascStocktakeDetailInclude = {
  ascCenter: { select: { id: true, centerName: true, centerCode: true } },
  creator: { select: { id: true, fullName: true, companyEmail: true } },
  items: {
    include: {
      accessory: { select: { id: true, name: true, partNumber: true, unitPrice: true } },
    },
    orderBy: { id: 'asc' },
  },
} satisfies Prisma.AscStocktakeInclude;

export class AscStocktakeRepository implements IAscStocktakeRepository {
  private buildHistoryWhere(input: FindAllAscStocktakesInput): Prisma.AscStocktakeWhereInput {
    return {
      ascCenterId: input.ascCenterId,
      ...(input.createdBy ? { createdBy: input.createdBy } : {}),
      ...(input.createdAtFrom || input.createdAtTo
        ? {
            createdAt: {
              ...(input.createdAtFrom ? { gte: new Date(input.createdAtFrom) } : {}),
              ...(input.createdAtTo ? { lte: new Date(input.createdAtTo) } : {}),
            },
          }
        : {}),
      ...(input.search ? { notes: { contains: input.search, mode: 'insensitive' } } : {}),
    };
  }

  async findManyHistory(input: FindAllAscStocktakesInput) {
    const skip = (input.page - 1) * input.limit;
    return prisma.ascStocktake.findMany({
      where: this.buildHistoryWhere(input),
      select: ascStocktakeListSelect,
      orderBy: { [input.sortBy]: input.sortOrder },
      skip,
      take: input.limit,
    });
  }

  async countHistory(input: FindAllAscStocktakesInput) {
    return prisma.ascStocktake.count({
      where: this.buildHistoryWhere(input),
    });
  }

  async findById(id: string) {
    return prisma.ascStocktake.findUnique({
      where: { id },
      include: ascStocktakeDetailInclude,
    });
  }

  private buildAccessoriesWhere(input: FindStocktakeAccessoriesInput): Prisma.AccessoryWhereInput {
    return {
      status: input.status,
      ...(input.categoryId ? { categoryId: input.categoryId } : {}),
      ...(input.search
        ? {
            OR: [
              { name: { contains: input.search, mode: 'insensitive' } },
              { partNumber: { contains: input.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
  }

  async findAccessoriesForStocktake(input: FindStocktakeAccessoriesInput) {
    const skip = (input.page - 1) * input.limit;
    return prisma.accessory.findMany({
      where: this.buildAccessoriesWhere(input),
      select: {
        id: true,
        name: true,
        partNumber: true,
        partGroupName: true,
        unitPrice: true,
        category: { select: { id: true, name: true } },
        stockLevels: {
          where: { ascCenterId: input.ascCenterId },
          select: {
            currentStock: true,
            reservedStock: true,
            minStockLevel: true,
            lastUpdated: true,
          },
        },
      },
      orderBy: { [input.sortBy]: input.sortOrder },
      skip,
      take: input.limit,
    });
  }

  async countAccessoriesForStocktake(input: FindStocktakeAccessoriesInput) {
    return prisma.accessory.count({
      where: this.buildAccessoriesWhere(input),
    });
  }

  private buildStockLevelsWhere(input: FindStocktakeStockLevelsInput): Prisma.AscAccessoryStockWhereInput {
    // If Prisma field reference is supported, we can use prisma.ascAccessoryStock.fields.minStockLevel
    // Fallback: If belowMin is true and field ref is not supported, we must filter in memory later.
    return {
      ascCenterId: input.ascCenterId,
      accessory: {
        ...(input.categoryId ? { categoryId: input.categoryId } : {}),
        ...(input.search
          ? {
              OR: [
                { name: { contains: input.search, mode: 'insensitive' } },
                { partNumber: { contains: input.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      // Note: If this fails in older Prisma versions, we remove this and filter in memory.
      ...(input.belowMin
        ? { currentStock: { lt: prisma.ascAccessoryStock.fields.minStockLevel } }
        : {}),
    };
  }

  async findStockLevels(input: FindStocktakeStockLevelsInput) {
    const skip = (input.page - 1) * input.limit;
    return prisma.ascAccessoryStock.findMany({
      where: this.buildStockLevelsWhere(input),
      include: {
        accessory: {
          select: {
            id: true,
            name: true,
            partNumber: true,
            partGroupName: true,
            unitPrice: true,
            category: { select: { id: true, name: true } },
          },
        },
      },
      orderBy:
        input.sortBy === 'name'
          ? { accessory: { name: input.sortOrder } }
          : { [input.sortBy]: input.sortOrder },
      skip,
      take: input.limit,
    });
  }

  async countStockLevels(input: FindStocktakeStockLevelsInput) {
    return prisma.ascAccessoryStock.count({
      where: this.buildStockLevelsWhere(input),
    });
  }

  async createWithSideEffects(args: {
    ascCenterId: string;
    createdBy: string;
    notes?: string;
    items: Array<{ accessoryId: string; newQty: number; notes?: string }>;
  }) {
    const { ascCenterId, createdBy, notes, items } = args;
    const accessoryIds = items.map((i) => i.accessoryId);

    return prisma.$transaction(async (tx) => {
      // 1. Guard center exists and active
      const center = await tx.ascCenter.findUnique({
        where: { id: ascCenterId },
        select: { id: true, status: true },
      });
      if (!center) throw new Error('NOT_FOUND: ASC Center not found');
      if (center.status !== 'active') throw new Error('BAD_REQUEST: ASC Center is not active');

      // 2. Validate all accessoryIds exist
      const foundAccessories = await tx.accessory.findMany({
        where: { id: { in: accessoryIds } },
        select: { id: true },
      });
      if (foundAccessories.length !== accessoryIds.length) {
        throw new Error('BAD_REQUEST: One or more accessoryIds are invalid');
      }

      // 3. Get current stock for all items
      const currentStocks = await tx.ascAccessoryStock.findMany({
        where: { ascCenterId, accessoryId: { in: accessoryIds } },
      });
      const stockMap = new Map(currentStocks.map((s) => [s.accessoryId, s.currentStock]));

      // 4. Create stocktake header
      const stocktake = await tx.ascStocktake.create({
        data: { ascCenterId, notes, createdBy },
      });

      // 5. Upsert stock and write ledger for each item
      for (const item of items) {
        const previousQty = stockMap.get(item.accessoryId) ?? 0;
        const deltaQty = item.newQty - previousQty;

        await tx.ascAccessoryStock.upsert({
          where: { ascCenterId_accessoryId: { ascCenterId, accessoryId: item.accessoryId } },
          create: { ascCenterId, accessoryId: item.accessoryId, currentStock: item.newQty },
          update: { currentStock: item.newQty, lastUpdated: new Date() },
        });

        if (deltaQty !== 0) {
          await tx.accessoryStockTransaction.create({
            data: {
              accessoryId: item.accessoryId,
              ascCenterId,
              transactionType: 'adjustment',
              operation: deltaQty > 0 ? 'in' : 'out',
              quantity: Math.abs(deltaQty),
              balanceAfter: item.newQty,
              referenceId: stocktake.id,
              referenceType: 'asc_stocktake',
              createdBy,
              notes: item.notes ?? notes ?? null,
            },
          });
        }
      }

      // 6. Create items
      await tx.ascStocktakeItem.createMany({
        data: items.map((item) => {
          const previousQty = stockMap.get(item.accessoryId) ?? 0;
          return {
            stocktakeId: stocktake.id,
            accessoryId: item.accessoryId,
            previousQty,
            newQty: item.newQty,
            deltaQty: item.newQty - previousQty,
            notes: item.notes,
          };
        }),
      });

      // 7. Return detailed stocktake
      return tx.ascStocktake.findUnique({
        where: { id: stocktake.id },
        include: ascStocktakeDetailInclude,
      });
    });
  }
}
