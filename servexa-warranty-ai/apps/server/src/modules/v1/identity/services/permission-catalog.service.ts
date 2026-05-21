import type { Prisma } from '@servexa-warranty-ai/db/prisma/client'

import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { createOperationalError } from '@/middlewares/error-middleware'
import { buildPagination } from '@/utils/pagination'

import type { CreatePermissionDto, UpdatePermissionDto } from '../dtos/permission-catalog.dto'
import { PermissionCatalogRepository } from '../repositories/permission-catalog.repository'

const permissionSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
} satisfies Prisma.PermissionSelect

export type FindAllPermissionsInput = {
  page: number
  limit: number
  search: string
  sortBy: 'createdAt' | 'name'
  sortOrder: 'asc' | 'desc'
}

export class PermissionCatalogService {
  constructor(
    private readonly permissionCatalogRepository: PermissionCatalogRepository = new PermissionCatalogRepository(),
  ) {}

  async findAll(query: FindAllPermissionsInput) {
    const where: Prisma.PermissionWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {}

    const [items, total] = await Promise.all([
      this.permissionCatalogRepository.findAll({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.sortBy]: query.sortOrder },
        select: permissionSelect,
      }),
      this.permissionCatalogRepository.count(where),
    ])

    return {
      items,
      pagination: buildPagination(query.page, query.limit, total),
    }
  }

  async findOneById(permissionId: string) {
    const found = await this.permissionCatalogRepository.findOneById(permissionId, permissionSelect)

    if (!found) {
      throw createOperationalError('Permission not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    return found
  }

  async create(input: CreatePermissionDto) {
    const duplicate = await this.permissionCatalogRepository.findOneByName(input.name, {
      id: true,
    })

    if (duplicate) {
      throw createOperationalError('Permission name already exists', HTTP_RESPONSE_CODE.CONFLICT)
    }

    return this.permissionCatalogRepository.createOne(
      {
        name: input.name,
        description: input.description,
      },
      permissionSelect,
    )
  }

  async update(permissionId: string, input: UpdatePermissionDto) {
    await this.findOneById(permissionId)

    if (input.name) {
      const duplicate = await this.permissionCatalogRepository.findOneByName(input.name, {
        id: true,
      })
      if (duplicate && duplicate.id !== permissionId) {
        throw createOperationalError('Permission name already exists', HTTP_RESPONSE_CODE.CONFLICT)
      }
    }

    return this.permissionCatalogRepository.updateOneById(
      permissionId,
      {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
      },
      permissionSelect,
    )
  }

  async delete(permissionId: string) {
    await this.findOneById(permissionId)
    await this.permissionCatalogRepository.deleteById(permissionId)
    return { success: true }
  }
}
