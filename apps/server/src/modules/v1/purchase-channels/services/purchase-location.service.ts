import { Prisma } from '@/core/infra/prisma/generated/client'

import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { createOperationalError } from '@/middlewares/error-middleware'
import { buildPagination } from '@/utils/pagination'

import type {
  CreatePurchaseLocationDto,
  FindAllPurchaseLocationsInput,
  ReplacePurchaseLocationDto,
  UpdatePurchaseLocationDto,
} from '../dtos/purchase-location.dto'
import type { IPurchaseLocationGroupRepository } from '../interfaces/purchase-location-group-repository.interface'
import type { IPurchaseLocationRepository } from '../interfaces/purchase-location-repository.interface'
import type { IPurchaseLocationService } from '../interfaces/purchase-location-service.interface'
import { PurchaseLocationGroupRepository } from '../repositories/purchase-location-group.repository'
import { PurchaseLocationRepository } from '../repositories/purchase-location.repository'

const purchaseLocationSelect = {
  id: true,
  groupId: true,
  name: true,
  code: true,
  description: true,
  website: true,
  address: true,
  sortOrder: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  group: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
  _count: {
    select: {
      repairCases: true,
    },
  },
} satisfies Prisma.PurchaseLocationSelect

export class PurchaseLocationService implements IPurchaseLocationService {
  constructor(
    private readonly purchaseLocationRepository: IPurchaseLocationRepository = new PurchaseLocationRepository(),
    private readonly purchaseLocationGroupRepository: IPurchaseLocationGroupRepository = new PurchaseLocationGroupRepository(),
  ) {}

  async findAll(query: FindAllPurchaseLocationsInput) {
    const where: Prisma.PurchaseLocationWhereInput = {
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.groupId ? { groupId: query.groupId } : {}),
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
      this.purchaseLocationRepository.findAll({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.sortBy]: query.sortOrder },
        select: purchaseLocationSelect,
      }),
      this.purchaseLocationRepository.count(where),
    ])

    return {
      items,
      pagination: buildPagination(query.page, query.limit, total),
    }
  }

  async findOneById(locationId: string) {
    const found = await this.purchaseLocationRepository.findOneById(locationId, {
      select: purchaseLocationSelect,
    })

    if (!found) {
      throw createOperationalError('Purchase location not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    return found
  }

  async create(input: CreatePurchaseLocationDto, createdById: string) {
    // Check if group exists
    const groupExists = await this.purchaseLocationGroupRepository.findOneById(input.groupId, {
      select: { id: true },
    })

    if (!groupExists) {
      throw createOperationalError('Purchase location group not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    // Code must be unique globally
    const duplicate = (await this.purchaseLocationRepository.findOneByCode(input.code, {
      select: { id: true },
    })) as { id: string } | null

    if (duplicate) {
      throw createOperationalError('Purchase location code already exists', HTTP_RESPONSE_CODE.CONFLICT)
    }

    return this.purchaseLocationRepository.createOne(
      {
        group: { connect: { id: input.groupId } },
        name: input.name,
        code: input.code,
        description: input.description,
        website: input.website,
        address: input.address,
        sortOrder: input.sortOrder,
        isActive: input.isActive,
        creator: { connect: { id: createdById } },
      },
      { select: purchaseLocationSelect },
    )
  }

  async update(
    locationId: string,
    input: ReplacePurchaseLocationDto | UpdatePurchaseLocationDto,
    updatedById: string,
  ) {
    const existing = (await this.purchaseLocationRepository.findOneById(locationId, {
      select: { id: true, code: true, groupId: true },
    })) as { id: string; code: string; groupId: string } | null

    if (!existing) {
      throw createOperationalError('Purchase location not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    if (input.groupId !== undefined && input.groupId !== existing.groupId) {
      const groupExists = await this.purchaseLocationGroupRepository.findOneById(input.groupId, {
        select: { id: true },
      })

      if (!groupExists) {
        throw createOperationalError('Purchase location group not found', HTTP_RESPONSE_CODE.NOT_FOUND)
      }
    }

    if (input.code !== undefined && input.code !== existing.code) {
      const duplicate = (await this.purchaseLocationRepository.findOneByCode(input.code, {
        select: { id: true },
      })) as { id: string } | null

      if (duplicate && duplicate.id !== locationId) {
        throw createOperationalError('Purchase location code already exists', HTTP_RESPONSE_CODE.CONFLICT)
      }
    }

    const data: Prisma.PurchaseLocationUpdateInput = {
      updater: { connect: { id: updatedById } },
    }

    if (input.groupId !== undefined) data.group = { connect: { id: input.groupId } }
    if (input.name !== undefined) data.name = input.name
    if (input.code !== undefined) data.code = input.code
    if (input.description !== undefined) data.description = input.description
    if (input.website !== undefined) data.website = input.website
    if (input.address !== undefined) data.address = input.address
    if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder
    if (input.isActive !== undefined) data.isActive = input.isActive

    if (Object.keys(data).length === 1) {
      throw createOperationalError('No fields to update', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }

    return this.purchaseLocationRepository.updateOneById(locationId, data, {
      select: purchaseLocationSelect,
    })
  }

  async delete(locationId: string, updatedById: string) {
    const existing = await this.purchaseLocationRepository.findOneById(locationId, {
      select: { id: true },
    })

    if (!existing) {
      throw createOperationalError('Purchase location not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    // Soft deactivate
    await this.purchaseLocationRepository.updateOneById(locationId, {
      isActive: false,
      updater: { connect: { id: updatedById } },
    })

    return { success: true as const }
  }
}
