import type { z } from 'zod'

import {
  createAccessorySchema,
  createAscAccessoryStockSchema,
  createTotalWarehouseStockSchema,
  findAccessoriesFromAscCenterSchema,
  findAccessoriesFromTotalWarehouseSchema,
  findAccessoryStockByAscCenterSchema,
  findAccessoryStockByTotalWarehouseSchema,
  findAllAccessoriesSchema,
  findAllAccessoryStocksSchema,
  replaceAccessorySchema,
  replaceAscAccessoryStockSchema,
  replaceTotalWarehouseStockSchema,
  updateAccessorySchema,
  updateAscAccessoryStockSchema,
  updateTotalWarehouseStockSchema,
} from '../validations'
import type { BasePagination } from 'src/types/pagination'
import { Prisma } from '@/core/infra/prisma/generated/client'
import type { AccessoryStatus as AccessoryStatusType } from '@/core/infra/prisma/generated/client'

export type FindAllAccessoriesInput = z.infer<typeof findAllAccessoriesSchema>
export type FindAllAccessoryStocksInput = z.infer<typeof findAllAccessoryStocksSchema>
export type FindAccessoriesFromTotalWarehouseParams = z.infer<typeof findAccessoriesFromTotalWarehouseSchema>
export type FindAccessoriesFromAscCenterParams = z.infer<typeof findAccessoriesFromAscCenterSchema>
export type FindAccessoriesFromTotalWarehouseInput = FindAccessoriesFromTotalWarehouseParams & FindAllAccessoryStocksInput
export type FindAccessoriesFromAscCenterInput = FindAccessoriesFromAscCenterParams & FindAllAccessoryStocksInput

export type FindAccessoryStockByTotalWarehouseInput = z.infer<typeof findAccessoryStockByTotalWarehouseSchema>
export type FindAccessoryStockByAscCenterInput = z.infer<typeof findAccessoryStockByAscCenterSchema>

export type CreateAccessoryDto = z.infer<typeof createAccessorySchema>
export type ReplaceAccessoryDto = z.infer<typeof replaceAccessorySchema>
export type UpdateAccessoryDto = z.infer<typeof updateAccessorySchema>

export type CreateTotalWarehouseStockDto = z.infer<typeof createTotalWarehouseStockSchema>
export type ReplaceTotalWarehouseStockDto = z.infer<typeof replaceTotalWarehouseStockSchema>
export type UpdateTotalWarehouseStockDto = z.infer<typeof updateTotalWarehouseStockSchema>

export type CreateAscAccessoryStockDto = z.infer<typeof createAscAccessoryStockSchema>
export type ReplaceAscAccessoryStockDto = z.infer<typeof replaceAscAccessoryStockSchema>
export type UpdateAscAccessoryStockDto = z.infer<typeof updateAscAccessoryStockSchema>

/**
 * Response DTOs ==============================================================================
 */
export type ResponseListAccessoriesDto = {
  items: {
    id: string;
    minStockLevel: number;
    name: string;
    categoryId: string;
    partNumber: string;
    description: string | null;
    image: string | null;
    partGroupNumber: string | null;
    partGroupName: string | null;
    partDescription: string | null;
    itemNumber: string | null;
    englishName: string | null;
    customerPrice: string | null;
    unitPrice: Prisma.Decimal | null;
    stockQuantity: number;
    supplier: string | null;
    status: AccessoryStatusType;
    createdAt: Date;
    updatedAt: Date;
}[]
  pagination: BasePagination
}

export type ResponseAccessoryDto = {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  status: AccessoryStatusType;
  categoryId: string;
  minStockLevel: number;
  partNumber: string;
  description: string | null;
  image: string | null;
  partGroupNumber: string | null;
  partGroupName: string | null;
  partDescription: string | null;
  itemNumber: string | null;
  englishName: string | null;
  customerPrice: string | null;
  unitPrice: Prisma.Decimal | null;
  stockQuantity: number;
  supplier: string | null;
  id: string;
} | null

export type ResponseCreateAccessoryDto = {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  status: AccessoryStatusType;
  categoryId: string;
  id: string;
  partNumber: string;
  description: string | null;
  image: string | null;
  partGroupNumber: string | null;
  partGroupName: string | null;
  partDescription: string | null;
  itemNumber: string | null;
  englishName: string | null;
  customerPrice: string | null;
  unitPrice: Prisma.Decimal | null;
  stockQuantity: number;
  minStockLevel: number;
  supplier: string | null;
}

export type ResponseUpdateAccessoryDto = {
  id: string;
  categoryId: string;
  name: string;
  partNumber: string;
  description: string | null;
  image: string | null;
  partGroupNumber: string | null;
  partGroupName: string | null;
  partDescription: string | null;
  itemNumber: string | null;
  englishName: string | null;
  customerPrice: string | null;
  unitPrice: Prisma.Decimal | null;
  stockQuantity: number;
  minStockLevel: number;
  supplier: string | null;
  status: AccessoryStatusType;
  createdAt: Date;
  updatedAt: Date;
}

export type ResponseDeleteAccessoryDto = {
  success: true;
}

export type ResponseFindAllFromTotalWarehouseDto = {
  items: {
    availableStock: number;
    isLowStock: boolean;
    needsRestock: boolean;
    totalWarehouseId: string;
    currentStock: number;
    accessoryId: string;
    reservedStock: number;
    minStockLevel: number;
    maxStockLevel: number;
    location: string | null;
    id: string;
    lastUpdated: Date;
    lastRestocked: Date | null;
  }[]
  pagination: BasePagination
}

export type ResponseFindAllFromAscCenterDto = {
  items: {
    currentQuantityFromLHTotalWarehouose: number;
    currentStock: number;
    accessoryId: string;
    reservedStock: number;
    minStockLevel: number;
    maxStockLevel: number;
    ascCenterId: string;
    id: string;
    lastUpdated: Date;
  }[]
  pagination: BasePagination
}

export type ResponseCreateFromTotalWarehouseDto = {
  lastUpdated: Date;
  id: string;
  accessoryId: string;
  currentStock: number;
  reservedStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  totalWarehouseId: string;
  location: string | null;
  lastRestocked: Date | null;
}

export type ResponseReplaceFromTotalWarehouseDto = {
  id: string;
  currentStock: number;
  reservedStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  location: string | null;
  lastRestocked: Date | null;
  lastUpdated: Date;
  totalWarehouseId: string;
  accessoryId: string;
}

export type ResponseUpdateFromTotalWarehouseDto = {
  totalWarehouseId: string;
  accessoryId: string;
  currentStock: number;
  reservedStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  location: string | null;
  id: string;
  lastRestocked: Date | null;
  lastUpdated: Date;
}

export type ResponseDeleteFromTotalWarehouseDto = {
  success: true;
}

export type ResponseCreateFromAscCenterDto = {
  id: string;
  accessoryId: string;
  currentStock: number;
  reservedStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  lastUpdated: Date;
  ascCenterId: string;
}

export type ResponseReplaceFromAscCenterDto = {
  id: string;
  currentStock: number;
  reservedStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  lastUpdated: Date;
  ascCenterId: string;
  accessoryId: string;
}

export type ResponseUpdateFromAscCenterDto = {
  ascCenterId: string;
  accessoryId: string;
  currentStock: number;
  reservedStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  id: string;
  lastUpdated: Date;
}

export type ResponseDeleteFromAscCenterDto = {
  success: true;
}