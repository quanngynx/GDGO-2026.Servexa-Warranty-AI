import { Prisma } from '@servexa-warranty-ai/db/prisma/client'

import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { createOperationalError } from '@/middlewares/error-middleware'
import { buildPagination } from '@/utils/pagination'

import type { CreateModelDto, ReplaceModelDto, UpdateModelDto } from '../dtos/model.dto'
import type { ICategoryRepository } from '../interfaces/category-repository.interface'
import type { IModelRepository } from '../interfaces/model-repository.interface'
import type { IModelService } from '../interfaces/model-service.interface'
import { CategoryRepository } from '../repositories/category.repository'
import { ModelRepository } from '../repositories/model.repository'

const modelSelect = {
  id: true,
  categoryId: true,
  name: true,
  modelCode: true,
  image: true,
  status: true,
  stockNumber: true,
  laborCost: true,
  inspectionCost: true,
  itemName: true,
  globalCategory: true,
  largeCategory: true,
  mediumCategory: true,
  productName: true,
  productDescription: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.ModelSelect

const modelDetailSelect = {
  id: true,
  categoryId: true,
  name: true,
  modelCode: true,
  image: true,
  status: true,
  stockNumber: true,
  laborCost: true,
  inspectionCost: true,
  itemName: true,
  globalCategory: true,
  largeCategory: true,
  mediumCategory: true,
  productName: true,
  productDescription: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      status: true,
    },
  },
  repairCases: {
    select: {
      id: true,
      caseNumber: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  },
} satisfies Prisma.ModelSelect

export type FindAllModelsInput = {
  page: number
  limit: number
  search: string
  sortBy: 'createdAt' | 'updatedAt' | 'name' | 'modelCode'
  sortOrder: 'asc' | 'desc'
  status?: 'active' | 'inactive'
  categoryId?: string
}

export class ModelService implements IModelService {
  constructor(
    private readonly modelRepository: IModelRepository = new ModelRepository(),
    private readonly categoryRepository: ICategoryRepository = new CategoryRepository(),
  ) {}

  private async ensureCategoryExists(categoryId: string) {
    const category = (await this.categoryRepository.findOneById(categoryId, {
      select: { id: true },
    })) as { id: string } | null

    if (!category) {
      throw createOperationalError('Category not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }
  }

  async findAll(query: FindAllModelsInput) {
    const where: Prisma.ModelWhereInput = {
      deletedAt: null,
      ...(query.status ? { status: query.status } : {}),
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { modelCode: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    }

    const [items, total] = await Promise.all([
      this.modelRepository.findAll({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
        select: modelSelect,
      }),
      this.modelRepository.count(where),
    ])

    return {
      items,
      pagination: buildPagination(query.page, query.limit, total),
    }
  }

  async findOneById(modelId: string) {
    const found = (await this.modelRepository.findOneById(modelId, {
      select: modelDetailSelect,
    })) as ({ deletedAt: Date | null } & Record<string, unknown>) | null

    if (!found || found.deletedAt) {
      throw createOperationalError('Model not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    return found
  }

  private buildCreateData(input: CreateModelDto | ReplaceModelDto): Prisma.ModelCreateInput {
    return {
      modelCode: input.modelCode,
      name: input.name,
      category: { connect: { id: input.categoryId } },
      image: input.image,
      status: input.status,
      stockNumber: input.stockNumber ?? 0,
      laborCost:
        input.laborCost === undefined || input.laborCost === null
          ? undefined
          : new Prisma.Decimal(input.laborCost),
      inspectionCost:
        input.inspectionCost === undefined || input.inspectionCost === null
          ? undefined
          : new Prisma.Decimal(input.inspectionCost),
      itemName: input.itemName,
      globalCategory: input.globalCategory,
      largeCategory: input.largeCategory,
      mediumCategory: input.mediumCategory,
      productName: input.productName,
      productDescription: input.productDescription,
    }
  }

  private buildUpdateInput(input: ReplaceModelDto | UpdateModelDto): Prisma.ModelUpdateInput {
    const data: Prisma.ModelUpdateInput = {}

    if (input.modelCode !== undefined) data.modelCode = input.modelCode
    if (input.name !== undefined) data.name = input.name
    if (input.categoryId !== undefined) data.category = { connect: { id: input.categoryId } }
    if (input.image !== undefined) data.image = input.image
    if (input.status !== undefined) data.status = input.status
    if (input.stockNumber !== undefined) data.stockNumber = input.stockNumber
    if (input.laborCost !== undefined) {
      data.laborCost = input.laborCost === null ? null : new Prisma.Decimal(input.laborCost)
    }
    if (input.inspectionCost !== undefined) {
      data.inspectionCost =
        input.inspectionCost === null ? null : new Prisma.Decimal(input.inspectionCost)
    }
    if (input.itemName !== undefined) data.itemName = input.itemName
    if (input.globalCategory !== undefined) data.globalCategory = input.globalCategory
    if (input.largeCategory !== undefined) data.largeCategory = input.largeCategory
    if (input.mediumCategory !== undefined) data.mediumCategory = input.mediumCategory
    if (input.productName !== undefined) data.productName = input.productName
    if (input.productDescription !== undefined) data.productDescription = input.productDescription

    return data
  }

  async create(input: CreateModelDto) {
    const duplicate = (await this.modelRepository.findOneByModelCode(input.modelCode, {
      select: { id: true },
    })) as { id: string } | null

    if (duplicate) {
      throw createOperationalError('Model code already exists', HTTP_RESPONSE_CODE.CONFLICT)
    }

    await this.ensureCategoryExists(input.categoryId)

    return this.modelRepository.createOne(this.buildCreateData(input), { select: modelSelect })
  }

  async update(modelId: string, input: ReplaceModelDto | UpdateModelDto) {
    const existing = (await this.modelRepository.findOneById(modelId, {
      select: { id: true, modelCode: true, deletedAt: true },
    })) as { id: string; modelCode: string; deletedAt: Date | null } | null

    if (!existing || existing.deletedAt) {
      throw createOperationalError('Model not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    if (input.modelCode !== undefined && input.modelCode !== existing.modelCode) {
      const duplicate = (await this.modelRepository.findOneByModelCode(input.modelCode, {
        select: { id: true },
      })) as { id: string } | null

      if (duplicate && duplicate.id !== modelId) {
        throw createOperationalError('Model code already exists', HTTP_RESPONSE_CODE.CONFLICT)
      }
    }

    if (input.categoryId !== undefined) {
      await this.ensureCategoryExists(input.categoryId)
    }

    const data = this.buildUpdateInput(input)

    if (Object.keys(data).length === 0) {
      throw createOperationalError('No fields to update', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }

    return this.modelRepository.updateOneById(modelId, data, { select: modelSelect })
  }

  async softDelete(modelId: string) {
    const existing = (await this.modelRepository.findOneById(modelId, {
      select: { id: true, deletedAt: true },
    })) as { id: string; deletedAt: Date | null } | null

    if (!existing || existing.deletedAt) {
      throw createOperationalError('Model not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    await this.modelRepository.softDeleteById(modelId)

    return { success: true as const }
  }

  async restore(modelId: string) {
    const existing = (await this.modelRepository.findOneById(modelId, {
      select: { id: true, deletedAt: true },
    })) as { id: string; deletedAt: Date | null } | null

    if (!existing) {
      throw createOperationalError('Model not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    if (!existing.deletedAt) {
      throw createOperationalError('Model is not deleted', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }

    await this.modelRepository.restoreById(modelId)

    return this.modelRepository.findOneById(modelId, { select: modelSelect })
  }
}
