import type { CreateModelDto, ReplaceModelDto, UpdateModelDto } from '../dtos/model.dto'
import type { FindAllModelsInput } from '../services/model.service'

export interface IModelService {
  findAll(query: FindAllModelsInput): Promise<unknown>
  findOneById(modelId: string): Promise<unknown>
  create(input: CreateModelDto): Promise<unknown>
  update(modelId: string, input: ReplaceModelDto | UpdateModelDto): Promise<unknown>
  softDelete(modelId: string): Promise<{ success: true }>
  restore(modelId: string): Promise<unknown>
}
