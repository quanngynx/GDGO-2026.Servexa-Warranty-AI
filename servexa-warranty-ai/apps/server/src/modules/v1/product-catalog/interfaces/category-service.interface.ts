import type { CreateCategoryDto, ReplaceCategoryDto, UpdateCategoryDto } from '../dtos/category.dto'
import type { FindAllCategoriesInput } from '../services/category.service'

export interface ICategoryService {
  findAll(query: FindAllCategoriesInput): Promise<unknown>
  findOneById(categoryId: string): Promise<unknown>
  create(input: CreateCategoryDto): Promise<unknown>
  update(categoryId: string, input: ReplaceCategoryDto | UpdateCategoryDto): Promise<unknown>
  delete(categoryId: string): Promise<{ success: true }>
}
