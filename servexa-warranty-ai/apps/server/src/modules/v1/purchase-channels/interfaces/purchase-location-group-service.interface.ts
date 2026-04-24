import type {
  CreatePurchaseLocationGroupDto,
  FindAllPurchaseLocationGroupsInput,
  ReplacePurchaseLocationGroupDto,
  UpdatePurchaseLocationGroupDto,
} from '../dtos/purchase-location-group.dto'

export interface IPurchaseLocationGroupService {
  findAll(query: FindAllPurchaseLocationGroupsInput): Promise<unknown>
  findOneById(groupId: string): Promise<unknown>
  create(input: CreatePurchaseLocationGroupDto, createdById: string): Promise<unknown>
  update(groupId: string, input: ReplacePurchaseLocationGroupDto | UpdatePurchaseLocationGroupDto, updatedById: string): Promise<unknown>
  delete(groupId: string, updatedById: string): Promise<{ success: true }>
}
