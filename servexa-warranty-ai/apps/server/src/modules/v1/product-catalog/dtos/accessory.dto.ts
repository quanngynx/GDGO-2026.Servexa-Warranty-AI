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
