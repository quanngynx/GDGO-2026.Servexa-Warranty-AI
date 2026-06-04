import { type Model, Prisma } from '@/core/infra/prisma/generated/client'
import type { CreateModelDto, ReplaceModelDto, UpdateModelDto } from '../dtos/model.dto'
import type { FindAllModelsInput } from '../services/model.service'
import type { BasePagination } from '@/types/pagination'

export interface IModelService {
  findAll(query: FindAllModelsInput): Promise<{ items: (Model & Prisma.ModelInclude)[] | null, pagination: BasePagination }>
  findOneById(modelId: string): Promise<(Model & Prisma.ModelInclude) | null>
  create(input: CreateModelDto): Promise<(Model & Prisma.ModelInclude) | null>
  update(modelId: string, input: ReplaceModelDto | UpdateModelDto): Promise<(Model & Prisma.ModelInclude) | null>
  softDelete(modelId: string): Promise<{ success: true }>
  restore(modelId: string): Promise<unknown>
}
