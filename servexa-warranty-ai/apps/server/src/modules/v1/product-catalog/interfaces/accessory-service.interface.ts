import type { CreateAccessoryDto, ReplaceAccessoryDto, UpdateAccessoryDto } from '../dtos/accessory.dto'
import type { FindAllCategoriesInput } from '../services/category.service'

export interface IAccessoryService {
  findAll(query: FindAllCategoriesInput): Promise<unknown>
  findOneById(accessoryId: string): Promise<unknown>
  create(input: CreateAccessoryDto): Promise<unknown>
  update(accessoryId: string, input: ReplaceAccessoryDto | UpdateAccessoryDto): Promise<unknown>
  delete(accessoryId: string): Promise<{ success: true }>
}
