import { env } from "@servexa-warranty-ai/env/server";
import { Prisma } from "@servexa-warranty-ai/db/prisma/client";

import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { createOperationalError } from "@/middlewares/error-middleware";
import { buildPagination } from "@/utils/pagination";

import type {
  CreateAccessoryDto,
  CreateAscAccessoryStockDto,
  CreateTotalWarehouseStockDto,
  FindAccessoryStockByAscCenterInput,
  FindAccessoryStockByTotalWarehouseInput,
  FindAllAccessoriesInput,
  FindAccessoriesFromAscCenterInput,
  FindAccessoriesFromAscCenterParams,
  FindAccessoriesFromTotalWarehouseInput,
  FindAccessoriesFromTotalWarehouseParams,
  ReplaceAccessoryDto,
  ReplaceAscAccessoryStockDto,
  ReplaceTotalWarehouseStockDto,
  UpdateAccessoryDto,
  UpdateAscAccessoryStockDto,
  UpdateTotalWarehouseStockDto,
} from "../dtos/accessory.dto";
import type { IAccessoryService } from "../interfaces/accessory-service.interface";
import { AccessoryRepository } from "../repositories/accessory.repository";

const accessorySelect = {
  id: true,
  categoryId: true,
  partNumber: true,
  name: true,
  description: true,
  status: true,
  image: true,
  stockQuantity: true,
  minStockLevel: true,
  supplier: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.AccessorySelect;

const accessoryWhereBySearch = (
  search: string,
):
  | Prisma.TotalWarehouseStockWhereInput["accessory"]
  | Prisma.AscAccessoryStockWhereInput["accessory"] => {
  if (!search) {
    return undefined;
  }

  return {
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { partNumber: { contains: search, mode: "insensitive" } },
      { englishName: { contains: search, mode: "insensitive" } },
    ],
  };
};

const warehouseOrderBy = (
  sortBy: "createdAt" | "updatedAt" | "name",
  sortOrder: "asc" | "desc",
) => {
  if (sortBy === "name") {
    return {
      accessory: { name: sortOrder },
    } satisfies Prisma.TotalWarehouseStockOrderByWithRelationInput;
  }

  return {
    lastUpdated: sortOrder,
  } satisfies Prisma.TotalWarehouseStockOrderByWithRelationInput;
};

export class AccessoryService implements IAccessoryService {
  constructor(
    private readonly accessoryRepository: AccessoryRepository = new AccessoryRepository(),
  ) {}

  async findAll(query: FindAllAccessoriesInput) {
    const where: Prisma.AccessoryWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
              { partNumber: { contains: query.search, mode: "insensitive" } },
              { englishName: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.accessoryRepository.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
        select: accessorySelect,
      }),
      this.accessoryRepository.count(where),
    ]);

    return {
      items,
      pagination: buildPagination(query.page, query.limit, total),
    };
  }

  async findOneById(accessoryId: string) {
    const found = await this.accessoryRepository.findOneById(accessoryId, {
      select: accessorySelect,
    });

    if (!found) {
      throw createOperationalError(
        "Accessory not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }

    return found;
  }

  async create(input: CreateAccessoryDto) {
    const duplicate = await this.accessoryRepository.findOneByPartNumber(
      input.partNumber,
      {
        select: { id: true },
      },
    );

    if (duplicate) {
      throw createOperationalError(
        "Accessory part number already exists",
        HTTP_RESPONSE_CODE.CONFLICT,
      );
    }

    const created = await this.accessoryRepository.createOne(
      {
        category: { connect: { id: input.categoryId } },
        name: input.name,
        partNumber: input.partNumber,
        description: input.description,
        image: input.image,
        partGroupNumber: input.partGroupNumber,
        partGroupName: input.partGroupName,
        partDescription: input.partDescription,
        itemNumber: input.itemNumber,
        englishName: input.englishName,
        customerPrice: input.customerPrice,
        unitPrice:
          input.unitPrice === null || input.unitPrice === undefined
            ? null
            : new Prisma.Decimal(input.unitPrice),
        stockQuantity: input.stockQuantity,
        minStockLevel: input.minStockLevel,
        supplier: input.supplier,
        status: input.status,
      },
      { select: accessorySelect },
    );
    return created;
  }

  async update(
    accessoryId: string,
    input: ReplaceAccessoryDto | UpdateAccessoryDto,
  ) {
    const existing = await this.accessoryRepository.findOneById(accessoryId, {
      select: { id: true, partNumber: true },
    });

    if (!existing) {
      throw createOperationalError(
        "Accessory not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }

    if (
      input.partNumber !== undefined &&
      input.partNumber !== existing.partNumber
    ) {
      const duplicate = await this.accessoryRepository.findOneByPartNumber(
        input.partNumber,
        {
          select: { id: true },
        },
      );

      if (duplicate && duplicate.id !== accessoryId) {
        throw createOperationalError(
          "Accessory part number already exists",
          HTTP_RESPONSE_CODE.CONFLICT,
        );
      }
    }

    const data: Prisma.AccessoryUpdateInput = {};

    if (input.categoryId !== undefined)
      data.category = { connect: { id: input.categoryId } };
    if (input.name !== undefined) data.name = input.name;
    if (input.partNumber !== undefined) data.partNumber = input.partNumber;
    if (input.description !== undefined) data.description = input.description;
    if (input.image !== undefined) data.image = input.image;
    if (input.partGroupNumber !== undefined)
      data.partGroupNumber = input.partGroupNumber;
    if (input.partGroupName !== undefined)
      data.partGroupName = input.partGroupName;
    if (input.partDescription !== undefined)
      data.partDescription = input.partDescription;
    if (input.itemNumber !== undefined) data.itemNumber = input.itemNumber;
    if (input.englishName !== undefined) data.englishName = input.englishName;
    if (input.customerPrice !== undefined)
      data.customerPrice = input.customerPrice;
    if (input.unitPrice !== undefined) {
      data.unitPrice =
        input.unitPrice === null ? null : new Prisma.Decimal(input.unitPrice);
    }
    if (input.stockQuantity !== undefined)
      data.stockQuantity = input.stockQuantity;
    if (input.minStockLevel !== undefined)
      data.minStockLevel = input.minStockLevel;
    if (input.supplier !== undefined) data.supplier = input.supplier;
    if (input.status !== undefined) data.status = input.status;

    if (Object.keys(data).length === 0) {
      throw createOperationalError(
        "No fields to update",
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
    }

    const updated = await this.accessoryRepository.updateOneById(accessoryId, data, {
      select: accessorySelect,
    });
    return updated;
  }

  async delete(accessoryId: string) {
    const existing = await this.accessoryRepository.findOneById(accessoryId, {
      select: { id: true },
    });

    if (!existing) {
      throw createOperationalError(
        "Accessory not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }

    await this.accessoryRepository.deleteById(accessoryId);

    return { success: true as const };
  }

  async findAllFromTotalWarehouse(
    input: FindAccessoriesFromTotalWarehouseInput,
  ) {
    const where: Prisma.TotalWarehouseStockWhereInput = {
      totalWarehouseId: input.totalWarehouseId,
      ...(input.search
        ? {
            accessory: accessoryWhereBySearch(input.search),
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.accessoryRepository.findManyTotalWarehouseStock({
        where,
        skip: (input.page - 1) * input.limit,
        take: input.limit,
        orderBy: warehouseOrderBy(input.sortBy, input.sortOrder),
        include: {
          accessory: true,
          totalWarehouse: true,
        },
      }),
      this.accessoryRepository.countTotalWarehouseStock(where),
    ]);

    return {
      items: items.map((item) => ({
        ...item,
        availableStock: item.currentStock - item.reservedStock,
        isLowStock: item.currentStock <= item.minStockLevel,
        needsRestock: item.currentStock < item.minStockLevel,
      })),
      pagination: buildPagination(input.page, input.limit, total),
    };
  }

  async findAllFromAscCenter(input: FindAccessoriesFromAscCenterInput) {
    const longHauWarehouseName = env.LH_TOTAL_WAREHOUSE_NAME?.trim();

    if (!longHauWarehouseName) {
      throw createOperationalError(
        "Missing LH_TOTAL_WAREHOUSE_NAME configuration",
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
    }

    const longHauWarehouse =
      await this.accessoryRepository.findTotalWarehouseByName(
        longHauWarehouseName,
      );
    const longHauWarehouseId = longHauWarehouse?.id;

    if (!longHauWarehouseId) {
      throw createOperationalError(
        `Total warehouse "${longHauWarehouseName}" not found`,
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }

    const where: Prisma.AscAccessoryStockWhereInput = {
      ascCenterId: input.ascCenterId,
      ...(input.search
        ? {
            accessory: accessoryWhereBySearch(input.search),
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.accessoryRepository.findManyAscAccessoryStock({
        where,
        skip: (input.page - 1) * input.limit,
        take: input.limit,
        orderBy:
          input.sortBy === "name"
            ? { accessory: { name: input.sortOrder } }
            : { lastUpdated: input.sortOrder },
        include: {
          accessory: true,
          ascCenter: true,
        },
      }),
      this.accessoryRepository.countAscAccessoryStock(where),
    ]);

    const accessoryIds = Array.from(
      new Set(items.map((item) => item.accessoryId)),
    );
    const longHauStocks = accessoryIds.length
      ? await this.accessoryRepository.findManyTotalWarehouseStock({
          where: {
            totalWarehouseId: longHauWarehouseId,
            accessoryId: { in: accessoryIds },
          },
          select: {
            id: true,
            accessoryId: true,
            currentStock: true,
          },
        })
      : [];

    const longHauStockMap = new Map<string, number>(
      longHauStocks.map((stock) => [stock.accessoryId, stock.currentStock]),
    );

    return {
      items: items.map((item) => ({
        ...item,
        currentQuantityFromLHTotalWarehouose:
          longHauStockMap.get(item.accessoryId) ?? 0,
      })),
      pagination: buildPagination(input.page, input.limit, total),
    };
  }

  async createFromTotalWarehouse(
    params: FindAccessoriesFromTotalWarehouseParams,
    input: CreateTotalWarehouseStockDto,
  ) {
    const existing = await this.accessoryRepository.findOneTotalWarehouseStock(
      params.totalWarehouseId,
      input.accessoryId,
      {
        select: { id: true },
      },
    );

    if (existing) {
      throw createOperationalError(
        "Total warehouse stock already exists",
        HTTP_RESPONSE_CODE.CONFLICT,
      );
    }

    const created = await this.accessoryRepository.createTotalWarehouseStock(
      {
        totalWarehouseId: params.totalWarehouseId,
        accessoryId: input.accessoryId,
        currentStock: input.currentStock,
        reservedStock: input.reservedStock,
        minStockLevel: input.minStockLevel,
        maxStockLevel: input.maxStockLevel,
        location: input.location ?? null,
      },
      {
        include: {
          accessory: true,
          totalWarehouse: true,
        },
      },
    );
    return created;
  }

  async replaceFromTotalWarehouse(
    params: FindAccessoryStockByTotalWarehouseInput,
    input: ReplaceTotalWarehouseStockDto,
  ) {
    await this.ensureTotalWarehouseStockExists(params);
    const updated = await this.accessoryRepository.updateTotalWarehouseStock(
      params.totalWarehouseId,
      params.accessoryId,
      {
        currentStock: input.currentStock,
        reservedStock: input.reservedStock,
        minStockLevel: input.minStockLevel,
        maxStockLevel: input.maxStockLevel,
        location: input.location ?? null,
      },
      {
        include: {
          accessory: true,
          totalWarehouse: true,
        },
      },
    );
    return updated;
  }

  async updateFromTotalWarehouse(
    params: FindAccessoryStockByTotalWarehouseInput,
    input: UpdateTotalWarehouseStockDto,
  ) {
    await this.ensureTotalWarehouseStockExists(params);

    const data: Prisma.TotalWarehouseStockUpdateInput = {};
    if (input.currentStock !== undefined)
      data.currentStock = input.currentStock;
    if (input.reservedStock !== undefined)
      data.reservedStock = input.reservedStock;
    if (input.minStockLevel !== undefined)
      data.minStockLevel = input.minStockLevel;
    if (input.maxStockLevel !== undefined)
      data.maxStockLevel = input.maxStockLevel;
    if (input.location !== undefined) data.location = input.location;

    const updated = await this.accessoryRepository.updateTotalWarehouseStock(
      params.totalWarehouseId,
      params.accessoryId,
      data,
      {
        include: {
          accessory: true,
          totalWarehouse: true,
        },
      },
    );
    return updated;
  }

  async deleteFromTotalWarehouse(
    params: FindAccessoryStockByTotalWarehouseInput,
  ) {
    await this.ensureTotalWarehouseStockExists(params);
    await this.accessoryRepository.deleteTotalWarehouseStock(
      params.totalWarehouseId,
      params.accessoryId,
    );
    return { success: true as const };
  }

  async createFromAscCenter(
    params: FindAccessoriesFromAscCenterParams,
    input: CreateAscAccessoryStockDto,
  ) {
    const existing = await this.accessoryRepository.findOneAscAccessoryStock(
      params.ascCenterId,
      input.accessoryId,
      {
        select: { id: true },
      },
    );

    if (existing) {
      throw createOperationalError(
        "ASC accessory stock already exists",
        HTTP_RESPONSE_CODE.CONFLICT,
      );
    }

    const created = await this.accessoryRepository.createAscAccessoryStock(
      {
        ascCenterId: params.ascCenterId,
        accessoryId: input.accessoryId,
        currentStock: input.currentStock,
        reservedStock: input.reservedStock,
        minStockLevel: input.minStockLevel,
        maxStockLevel: input.maxStockLevel,
      },
      {
        include: {
          accessory: true,
          ascCenter: true,
        },
      },
    );
    return created;
  }

  async replaceFromAscCenter(
    params: FindAccessoryStockByAscCenterInput,
    input: ReplaceAscAccessoryStockDto,
  ) {
    await this.ensureAscAccessoryStockExists(params);
    const updated = await this.accessoryRepository.updateAscAccessoryStock(
      params.ascCenterId,
      params.accessoryId,
      {
        currentStock: input.currentStock,
        reservedStock: input.reservedStock,
        minStockLevel: input.minStockLevel,
        maxStockLevel: input.maxStockLevel,
      },
      {
        include: {
          accessory: true,
          ascCenter: true,
        },
      },
    );
    return updated;
  }

  async updateFromAscCenter(
    params: FindAccessoryStockByAscCenterInput,
    input: UpdateAscAccessoryStockDto,
  ) {
    await this.ensureAscAccessoryStockExists(params);

    const data: Prisma.AscAccessoryStockUpdateInput = {};
    if (input.currentStock !== undefined)
      data.currentStock = input.currentStock;
    if (input.reservedStock !== undefined)
      data.reservedStock = input.reservedStock;
    if (input.minStockLevel !== undefined)
      data.minStockLevel = input.minStockLevel;
    if (input.maxStockLevel !== undefined)
      data.maxStockLevel = input.maxStockLevel;

    const updated = await this.accessoryRepository.updateAscAccessoryStock(
      params.ascCenterId,
      params.accessoryId,
      data,
      {
        include: {
          accessory: true,
          ascCenter: true,
        },
      },
    );
    return updated;
  }

  async deleteFromAscCenter(params: FindAccessoryStockByAscCenterInput) {
    await this.ensureAscAccessoryStockExists(params);
    await this.accessoryRepository.deleteAscAccessoryStock(
      params.ascCenterId,
      params.accessoryId,
    );
    return { success: true as const };
  }

  private async ensureTotalWarehouseStockExists(
    params: FindAccessoryStockByTotalWarehouseInput,
  ) {
    const existing = await this.accessoryRepository.findOneTotalWarehouseStock(
      params.totalWarehouseId,
      params.accessoryId,
      {
        select: { id: true },
      },
    );

    if (!existing) {
      throw createOperationalError(
        "Total warehouse stock not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }
  }

  private async ensureAscAccessoryStockExists(
    params: FindAccessoryStockByAscCenterInput,
  ) {
    const existing = await this.accessoryRepository.findOneAscAccessoryStock(
      params.ascCenterId,
      params.accessoryId,
      {
        select: { id: true },
      },
    );

    if (!existing) {
      throw createOperationalError(
        "ASC accessory stock not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }
  }
}
