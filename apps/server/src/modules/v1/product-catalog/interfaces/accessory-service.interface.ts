import type {
  CreateAscAccessoryStockDto,
  CreateAccessoryDto,
  CreateTotalWarehouseStockDto,
  FindAccessoryStockByAscCenterInput,
  FindAccessoryStockByTotalWarehouseInput,
  FindAllAccessoriesInput,
  FindAccessoriesFromAscCenterInput,
  FindAccessoriesFromAscCenterParams,
  FindAccessoriesFromTotalWarehouseInput,
  FindAccessoriesFromTotalWarehouseParams,
  ReplaceAscAccessoryStockDto,
  ReplaceAccessoryDto,
  ReplaceTotalWarehouseStockDto,
  UpdateAscAccessoryStockDto,
  UpdateAccessoryDto,
  UpdateTotalWarehouseStockDto,
  ResponseAccessoryDto,
  ResponseUpdateAccessoryDto,
  ResponseCreateAccessoryDto,
  ResponseCreateFromTotalWarehouseDto,
  ResponseReplaceFromTotalWarehouseDto,
  ResponseUpdateFromTotalWarehouseDto,
  ResponseCreateFromAscCenterDto,
  ResponseReplaceFromAscCenterDto,
  ResponseUpdateFromAscCenterDto,
  ResponseDeleteFromAscCenterDto,
  ResponseDeleteAccessoryDto,
  ResponseDeleteFromTotalWarehouseDto,
} from "../dtos/accessory.dto";
import {
  type Accessory,
  type TotalWarehouseStock,
  type AscAccessoryStock,
  Prisma,
} from "@/core/infra/prisma/generated/client";
import type { BasePagination } from "src/types/pagination";

export interface IAccessoryService {
  findAll(
    query: FindAllAccessoriesInput,
  ): Promise<{
    items: (Accessory & Prisma.AccessoryInclude)[] | null;
    pagination: BasePagination;
  }>;
  findAllFromTotalWarehouse(
    input: FindAccessoriesFromTotalWarehouseInput,
  ): Promise<{
    items: (TotalWarehouseStock & Prisma.TotalWarehouseStockInclude)[] | null;
    pagination: BasePagination;
  }>;
  createFromTotalWarehouse(
    params: FindAccessoriesFromTotalWarehouseParams,
    input: CreateTotalWarehouseStockDto,
  ): Promise<ResponseCreateFromTotalWarehouseDto>;
  replaceFromTotalWarehouse(
    params: FindAccessoryStockByTotalWarehouseInput,
    input: ReplaceTotalWarehouseStockDto,
  ): Promise<ResponseReplaceFromTotalWarehouseDto>;
  updateFromTotalWarehouse(
    params: FindAccessoryStockByTotalWarehouseInput,
    input: UpdateTotalWarehouseStockDto,
  ): Promise<ResponseUpdateFromTotalWarehouseDto>;
  deleteFromTotalWarehouse(
    params: FindAccessoryStockByTotalWarehouseInput,
  ): Promise<ResponseDeleteFromTotalWarehouseDto>;
  findAllFromAscCenter(
    input: FindAccessoriesFromAscCenterInput,
  ): Promise<{
    items: (AscAccessoryStock & Prisma.AscAccessoryStockInclude)[] | null;
    pagination: BasePagination;
  }>;
  createFromAscCenter(
    params: FindAccessoriesFromAscCenterParams,
    input: CreateAscAccessoryStockDto,
  ): Promise<ResponseCreateFromAscCenterDto>;
  replaceFromAscCenter(
    params: FindAccessoryStockByAscCenterInput,
    input: ReplaceAscAccessoryStockDto,
  ): Promise<ResponseReplaceFromAscCenterDto>;
  updateFromAscCenter(
    params: FindAccessoryStockByAscCenterInput,
    input: UpdateAscAccessoryStockDto,
  ): Promise<ResponseUpdateFromAscCenterDto>;
  deleteFromAscCenter(
    params: FindAccessoryStockByAscCenterInput,
  ): Promise<ResponseDeleteFromAscCenterDto>;
  findOneById(accessoryId: string): Promise<ResponseAccessoryDto>;
  create(input: CreateAccessoryDto): Promise<ResponseCreateAccessoryDto>;
  update(
    accessoryId: string,
    input: ReplaceAccessoryDto | UpdateAccessoryDto,
  ): Promise<ResponseUpdateAccessoryDto>;
  delete(accessoryId: string): Promise<ResponseDeleteAccessoryDto>;
}
