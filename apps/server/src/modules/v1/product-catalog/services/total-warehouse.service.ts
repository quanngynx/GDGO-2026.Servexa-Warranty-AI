import { Prisma } from '@/core/infra/prisma/generated/client'

import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { createOperationalError } from '@/middlewares/error-middleware'
import { buildPagination } from '@/utils/pagination'

import type { CreateTotalWarehouseDto, ReplaceTotalWarehouseDto, UpdateTotalWarehouseDto } from '../dtos/total-warehouse.dto'
import type { ITotalWarehouseRepository, ITotalWarehouseService } from '../interfaces/total-warehouse.interface'
import { TotalWarehouseRepository } from '../repositories/total-warehouse.repository'

const totalWarehouseSelect = {
  id: true,
  name: true,
  address: true,
  status: true,
  createdBy: true,
  updatedBy: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TotalWarehouseSelect

export type FindAllTotalWarehousesInput = {
  page: number
  limit: number
  search: string
  sortBy: 'createdAt' | 'updatedAt' | 'name'
  sortOrder: 'asc' | 'desc'
  status?: 'active' | 'inactive'
}

export class TotalWarehouseService implements ITotalWarehouseService {
  constructor(private readonly totalWarehouseRepository: ITotalWarehouseRepository = new TotalWarehouseRepository()) {}

  async findAll(query: FindAllTotalWarehousesInput) {
    const where: Prisma.TotalWarehouseWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { address: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    }

    const [items, total] = await Promise.all([
      this.totalWarehouseRepository.findAll({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.sortBy]: query.sortOrder },
        select: totalWarehouseSelect,
      }),
      this.totalWarehouseRepository.count(where),
    ])

    return {
      items,
      pagination: buildPagination(query.page, query.limit, total),
    }
  }

  async findOneById(totalWarehouseId: string) {
    const found = await this.totalWarehouseRepository.findOneById(totalWarehouseId, {
      select: totalWarehouseSelect,
    })

    if (!found) {
      throw createOperationalError('Total warehouse not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    return found
  }

  async create(input: CreateTotalWarehouseDto, createdBy: string) {
    const duplicate = (await this.totalWarehouseRepository.findOneByName(input.name, {
      select: { id: true },
    })) as { id: string } | null

    if (duplicate) {
      throw createOperationalError('Total warehouse name already exists', HTTP_RESPONSE_CODE.CONFLICT)
    }

    return this.totalWarehouseRepository.createOne(
      {
        name: input.name,
        address: input.address,
        status: input.status,
        createdBy,
        updatedBy: createdBy,
      },
      { select: totalWarehouseSelect },
    )
  }

  async update(totalWarehouseId: string, input: ReplaceTotalWarehouseDto | UpdateTotalWarehouseDto, updatedBy: string) {
    const existing = (await this.totalWarehouseRepository.findOneById(totalWarehouseId, {
      select: { id: true, name: true },
    })) as { id: string; name: string } | null

    if (!existing) {
      throw createOperationalError('Total warehouse not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    if (input.name !== undefined && input.name !== existing.name) {
      const duplicate = (await this.totalWarehouseRepository.findOneByName(input.name, {
        select: { id: true },
      })) as { id: string } | null

      if (duplicate && duplicate.id !== totalWarehouseId) {
        throw createOperationalError('Total warehouse name already exists', HTTP_RESPONSE_CODE.CONFLICT)
      }
    }

    const data: Prisma.TotalWarehouseUpdateInput = { updatedBy }

    if (input.name !== undefined) data.name = input.name
    if (input.address !== undefined) data.address = input.address
    if (input.status !== undefined) data.status = input.status

    if (Object.keys(data).length === 1) {
      // only updatedBy — no real fields to change
      throw createOperationalError('No fields to update', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }

    return this.totalWarehouseRepository.updateOneById(totalWarehouseId, data, { select: totalWarehouseSelect })
  }

  async delete(totalWarehouseId: string) {
    const existing = await this.totalWarehouseRepository.findOneById(totalWarehouseId, {
      select: { id: true },
    })

    if (!existing) {
      throw createOperationalError('Total warehouse not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    await this.totalWarehouseRepository.deleteById(totalWarehouseId)

    return { success: true as const }
  }
}
