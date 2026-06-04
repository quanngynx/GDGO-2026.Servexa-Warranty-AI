import { Prisma } from '@/core/infra/prisma/generated/client'

import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { createOperationalError } from '@/middlewares/error-middleware'
import { buildPagination } from '@/utils/pagination'

import type {
  CreatePurchaseLocationGroupDto,
  FindAllPurchaseLocationGroupsInput,
  ReplacePurchaseLocationGroupDto,
  UpdatePurchaseLocationGroupDto,
} from '../dtos/purchase-location-group.dto'
import type { IPurchaseLocationGroupRepository } from '../interfaces/purchase-location-group-repository.interface'
import type { IPurchaseLocationGroupService } from '../interfaces/purchase-location-group-service.interface'
import { PurchaseLocationGroupRepository } from '../repositories/purchase-location-group.repository'

const purchaseLocationGroupSelect = {
  id: true,
  name: true,
  code: true,
  description: true,
  sortOrder: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
} satisfies Prisma.PurchaseLocationGroupSelect

export class PurchaseLocationGroupService implements IPurchaseLocationGroupService {
  constructor(
    private readonly purchaseLocationGroupRepository: IPurchaseLocationGroupRepository = new PurchaseLocationGroupRepository(),
  ) {}

  async findAll(query: FindAllPurchaseLocationGroupsInput) {
    const where: Prisma.PurchaseLocationGroupWhereInput = {
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { code: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    }

    const [items, total] = await Promise.all([
      this.purchaseLocationGroupRepository.findAll({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.sortBy]: query.sortOrder },
        select: purchaseLocationGroupSelect,
      }),
      this.purchaseLocationGroupRepository.count(where),
    ])

    return {
      items,
      pagination: buildPagination(query.page, query.limit, total),
    }
  }

  async findOneById(groupId: string) {
    const found = await this.purchaseLocationGroupRepository.findOneById(groupId, {
      select: purchaseLocationGroupSelect,
    })

    if (!found) {
      throw createOperationalError('Purchase location group not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    return found
  }

  async create(input: CreatePurchaseLocationGroupDto, createdById: string) {
    const duplicate = (await this.purchaseLocationGroupRepository.findOneByCode(input.code, {
      select: { id: true },
    })) as { id: string } | null

    if (duplicate) {
      throw createOperationalError('Purchase location group code already exists', HTTP_RESPONSE_CODE.CONFLICT)
    }

    return this.purchaseLocationGroupRepository.createOne(
      {
        name: input.name,
        code: input.code,
        description: input.description,
        sortOrder: input.sortOrder,
        isActive: input.isActive,
        creator: { connect: { id: createdById } },
      },
      { select: purchaseLocationGroupSelect },
    )
  }

  async update(
    groupId: string,
    input: ReplacePurchaseLocationGroupDto | UpdatePurchaseLocationGroupDto,
    updatedById: string,
  ) {
    const existing = (await this.purchaseLocationGroupRepository.findOneById(groupId, {
      select: { id: true, code: true },
    })) as { id: string; code: string } | null

    if (!existing) {
      throw createOperationalError('Purchase location group not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    if (input.code !== undefined && input.code !== existing.code) {
      const duplicate = (await this.purchaseLocationGroupRepository.findOneByCode(input.code, {
        select: { id: true },
      })) as { id: string } | null

      if (duplicate && duplicate.id !== groupId) {
        throw createOperationalError('Purchase location group code already exists', HTTP_RESPONSE_CODE.CONFLICT)
      }
    }

    const data: Prisma.PurchaseLocationGroupUpdateInput = {
      updater: { connect: { id: updatedById } },
    }

    if (input.name !== undefined) data.name = input.name
    if (input.code !== undefined) data.code = input.code
    if (input.description !== undefined) data.description = input.description
    if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder
    if (input.isActive !== undefined) data.isActive = input.isActive

    if (Object.keys(data).length === 1) {
      throw createOperationalError('No fields to update', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }

    return this.purchaseLocationGroupRepository.updateOneById(groupId, data, {
      select: purchaseLocationGroupSelect,
    })
  }

  async delete(groupId: string, updatedById: string) {
    const existing = await this.purchaseLocationGroupRepository.findOneById(groupId, {
      select: { id: true },
    })

    if (!existing) {
      throw createOperationalError('Purchase location group not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    // Soft deactivate
    await this.purchaseLocationGroupRepository.updateOneById(groupId, {
      isActive: false,
      updater: { connect: { id: updatedById } },
    })

    return { success: true as const }
  }
}
