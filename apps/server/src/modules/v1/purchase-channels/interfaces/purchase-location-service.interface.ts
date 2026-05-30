import type {
  CreatePurchaseLocationDto,
  FindAllPurchaseLocationsInput,
  ReplacePurchaseLocationDto,
  UpdatePurchaseLocationDto,
} from '../dtos/purchase-location.dto'

export interface IPurchaseLocationService {
  findAll(query: FindAllPurchaseLocationsInput): Promise<unknown>
  findOneById(locationId: string): Promise<unknown>
  create(input: CreatePurchaseLocationDto, createdById: string): Promise<unknown>
  update(locationId: string, input: ReplacePurchaseLocationDto | UpdatePurchaseLocationDto, updatedById: string): Promise<unknown>
  delete(locationId: string, updatedById: string): Promise<{ success: true }>
}
