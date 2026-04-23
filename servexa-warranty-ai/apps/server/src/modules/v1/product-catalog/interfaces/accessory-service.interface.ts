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
} from '../dtos/accessory.dto'

export interface IAccessoryService {
  findAll(query: FindAllAccessoriesInput): Promise<unknown>
  findAllFromTotalWarehouse(input: FindAccessoriesFromTotalWarehouseInput): Promise<unknown>
  createFromTotalWarehouse(
    params: FindAccessoriesFromTotalWarehouseParams,
    input: CreateTotalWarehouseStockDto,
  ): Promise<unknown>
  replaceFromTotalWarehouse(
    params: FindAccessoryStockByTotalWarehouseInput,
    input: ReplaceTotalWarehouseStockDto,
  ): Promise<unknown>
  updateFromTotalWarehouse(
    params: FindAccessoryStockByTotalWarehouseInput,
    input: UpdateTotalWarehouseStockDto,
  ): Promise<unknown>
  deleteFromTotalWarehouse(params: FindAccessoryStockByTotalWarehouseInput): Promise<{ success: true }>
  findAllFromAscCenter(input: FindAccessoriesFromAscCenterInput): Promise<unknown>
  createFromAscCenter(params: FindAccessoriesFromAscCenterParams, input: CreateAscAccessoryStockDto): Promise<unknown>
  replaceFromAscCenter(params: FindAccessoryStockByAscCenterInput, input: ReplaceAscAccessoryStockDto): Promise<unknown>
  updateFromAscCenter(params: FindAccessoryStockByAscCenterInput, input: UpdateAscAccessoryStockDto): Promise<unknown>
  deleteFromAscCenter(params: FindAccessoryStockByAscCenterInput): Promise<{ success: true }>
  findOneById(accessoryId: string): Promise<unknown>
  create(input: CreateAccessoryDto): Promise<unknown>
  update(accessoryId: string, input: ReplaceAccessoryDto | UpdateAccessoryDto): Promise<unknown>
  delete(accessoryId: string): Promise<{ success: true }>
}
