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
  ResponseFindAllFromTotalWarehouseDto,
  ResponseFindAllFromAscCenterDto,
} from "../dtos/accessory.dto";
import {
  type Accessory,
  Prisma,
} from "@/core/infra/prisma/generated/client";
import type { BasePagination } from "src/types/pagination";

export interface IAccessoryService {
  findAll(
    query: FindAllAccessoriesInput,
  ): Promise<{
    items: (Accessory & Prisma.AccessoryInclude & { imageUrl: string | null })[] | null;
    pagination: BasePagination;
  }>;
  findAllFromTotalWarehouse(
    input: FindAccessoriesFromTotalWarehouseInput,
  ): Promise<ResponseFindAllFromTotalWarehouseDto>;
  createFromTotalWarehouse(
    params: FindAccessoriesFromTotalWarehouseParams,
    input: CreateTotalWarehouseStockDto,
    file?: Express.Multer.File,
  ): Promise<ResponseCreateFromTotalWarehouseDto>;
  replaceFromTotalWarehouse(
    params: FindAccessoryStockByTotalWarehouseInput,
    input: ReplaceTotalWarehouseStockDto,
    file?: Express.Multer.File,
  ): Promise<ResponseReplaceFromTotalWarehouseDto>;
  updateFromTotalWarehouse(
    params: FindAccessoryStockByTotalWarehouseInput,
    input: UpdateTotalWarehouseStockDto,
    file?: Express.Multer.File,
  ): Promise<ResponseUpdateFromTotalWarehouseDto>;
  deleteFromTotalWarehouse(
    params: FindAccessoryStockByTotalWarehouseInput,
  ): Promise<ResponseDeleteFromTotalWarehouseDto>;
  findAllFromAscCenter(
    input: FindAccessoriesFromAscCenterInput,
  ): Promise<ResponseFindAllFromAscCenterDto>;
  createFromAscCenter(
    params: FindAccessoriesFromAscCenterParams,
    input: CreateAscAccessoryStockDto,
    file?: Express.Multer.File,
  ): Promise<ResponseCreateFromAscCenterDto>;
  replaceFromAscCenter(
    params: FindAccessoryStockByAscCenterInput,
    input: ReplaceAscAccessoryStockDto,
    file?: Express.Multer.File,
  ): Promise<ResponseReplaceFromAscCenterDto>;
  updateFromAscCenter(
    params: FindAccessoryStockByAscCenterInput,
    input: UpdateAscAccessoryStockDto,
    file?: Express.Multer.File,
  ): Promise<ResponseUpdateFromAscCenterDto>;
  deleteFromAscCenter(
    params: FindAccessoryStockByAscCenterInput,
  ): Promise<ResponseDeleteFromAscCenterDto>;
  findOneById(accessoryId: string): Promise<ResponseAccessoryDto>;
  create(
    input: CreateAccessoryDto,
    file?: Express.Multer.File,
  ): Promise<ResponseCreateAccessoryDto>;
  update(
    accessoryId: string,
    input: ReplaceAccessoryDto | UpdateAccessoryDto,
    file?: Express.Multer.File,
  ): Promise<ResponseUpdateAccessoryDto>;
  delete(accessoryId: string): Promise<ResponseDeleteAccessoryDto>;
}
