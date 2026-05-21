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
  ResponseListAccessoriesDto,
  ResponseAccessoryDto,
  ResponseUpdateAccessoryDto,
  ResponseCreateAccessoryDto,
  ResponseFindAllFromTotalWarehouseDto,
  ResponseCreateFromTotalWarehouseDto,
  ResponseReplaceFromTotalWarehouseDto,
  ResponseUpdateFromTotalWarehouseDto,
  ResponseCreateFromAscCenterDto,
  ResponseReplaceFromAscCenterDto,
  ResponseUpdateFromAscCenterDto,
  ResponseDeleteFromAscCenterDto,
  ResponseDeleteAccessoryDto,
  ResponseDeleteFromTotalWarehouseDto,
  ResponseFindAllFromAscCenterDto,
} from "../dtos/accessory.dto";

export interface IAccessoryService {
  findAll(query: FindAllAccessoriesInput): Promise<ResponseListAccessoriesDto>;
  findAllFromTotalWarehouse(
    input: FindAccessoriesFromTotalWarehouseInput,
  ): Promise<ResponseFindAllFromTotalWarehouseDto>;
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
  ): Promise<ResponseFindAllFromAscCenterDto>;
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
