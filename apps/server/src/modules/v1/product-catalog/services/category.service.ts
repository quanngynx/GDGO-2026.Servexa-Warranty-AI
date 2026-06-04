import { Prisma, type Category } from '@/core/infra/prisma/generated/client'

import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { createOperationalError } from '@/middlewares/error-middleware'
import { buildPagination } from '@/utils/pagination'

import type { CreateCategoryDto, ReplaceCategoryDto, UpdateCategoryDto } from '../dtos/category.dto'
import type { ICategoryRepository } from '../interfaces/category-repository.interface'
import type { ICategoryService } from '../interfaces/category-service.interface'
import { CategoryRepository } from '../repositories/category.repository'
import type { BasePagination } from 'src/types/pagination'

const categorySelect = {
  id: true,
  name: true,
  description: true,
  status: true,
  laborCost: true,
  inspectionCost: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CategorySelect

export type FindAllCategoriesInput = {
  page: number
  limit: number
  search: string
  sortBy: 'createdAt' | 'updatedAt' | 'name'
  sortOrder: 'asc' | 'desc'
  status?: 'active' | 'inactive'
}

export class CategoryService implements ICategoryService {
  constructor(private readonly categoryRepository: ICategoryRepository = new CategoryRepository()) {}

  async findAll(query: FindAllCategoriesInput): Promise<{ items: (Category & Prisma.CategoryInclude)[] | null, pagination: BasePagination }> {
    const where: Prisma.CategoryWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    }

    const [items, total] = await Promise.all([
      this.categoryRepository.findAll({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
        select: categorySelect,
      }),
      this.categoryRepository.count(where),
    ])

    return {
      items,
      pagination: buildPagination(query.page, query.limit, total),
    }
  }

  async findOneById(categoryId: string): Promise<Category & Prisma.CategoryInclude | null> {
    const found = await this.categoryRepository.findOneById(categoryId, {
      select: categorySelect,
    })

    if (!found) {
      throw createOperationalError('Category not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    return found
  }

  async create(input: CreateCategoryDto): Promise<Category & Prisma.CategoryInclude | null> {
    const duplicate = (await this.categoryRepository.findOneByName(input.name, {
      select: { id: true },
    })) as { id: string } | null

    if (duplicate) {
      throw createOperationalError('Category name already exists', HTTP_RESPONSE_CODE.CONFLICT)
    }

    return this.categoryRepository.createOne(
      {
        name: input.name,
        description: input.description,
        status: input.status,
        laborCost: new Prisma.Decimal(input.laborCost ?? 0),
        inspectionCost: new Prisma.Decimal(input.inspectionCost ?? 0),
      },
      { select: categorySelect },
    )
  }

  async update(categoryId: string, input: ReplaceCategoryDto | UpdateCategoryDto): Promise<Category & Prisma.CategoryInclude | null> {
    const existing = (await this.categoryRepository.findOneById(categoryId, {
      select: { id: true, name: true },
    })) as { id: string; name: string } | null

    if (!existing) {
      throw createOperationalError('Category not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    if (input.name !== undefined && input.name !== existing.name) {
      const duplicate = (await this.categoryRepository.findOneByName(input.name, {
        select: { id: true },
      })) as { id: string } | null

      if (duplicate && duplicate.id !== categoryId) {
        throw createOperationalError('Category name already exists', HTTP_RESPONSE_CODE.CONFLICT)
      }
    }

    const data: Prisma.CategoryUpdateInput = {}

    if (input.name !== undefined) data.name = input.name
    if (input.description !== undefined) data.description = input.description
    if (input.status !== undefined) data.status = input.status
    if (input.laborCost !== undefined) data.laborCost = new Prisma.Decimal(input.laborCost)
    if (input.inspectionCost !== undefined) data.inspectionCost = new Prisma.Decimal(input.inspectionCost)

    if (Object.keys(data).length === 0) {
      throw createOperationalError('No fields to update', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }

    return this.categoryRepository.updateOneById(categoryId, data, { select: categorySelect })
  }

  async delete(categoryId: string) {
    const existing = await this.categoryRepository.findOneById(categoryId, {
      select: { id: true },
    })

    if (!existing) {
      throw createOperationalError('Category not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    await this.categoryRepository.deleteById(categoryId)

    return { success: true as const }
  }
}
