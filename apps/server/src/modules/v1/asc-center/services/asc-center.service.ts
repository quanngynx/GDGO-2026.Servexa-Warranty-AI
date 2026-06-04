import { Prisma } from '@/core/infra/prisma/generated/client'

import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { createOperationalError } from '@/middlewares/error-middleware'
import { buildPagination } from '@/utils/pagination'

import type { CreateAscCenterDto, ReplaceAscCenterDto, UpdateAscCenterDto } from '../dtos/asc-center.dto'
import type { IAscCenterRepository, IAscCenterService } from '../../asc-center/interfaces/asc-center.interface'
import { AscCenterRepository } from '../repositories/asc-center.repository'

const ascCenterSelect = {
  id: true,
  centerName: true,
  centerCode: true,
  companyName: true,
  region: true,
  email: true,
  address: true,
  wardId: true,
  provinceId: true,
  phone: true,
  licenseNumber: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  province: {
    select: { id: true, name: true, code: true }
  },
  ward: {
    select: { id: true, name: true }
  },
  _count: {
    select: {
      users: true // Count of users assigned to this center
    }
  }
} satisfies Prisma.AscCenterSelect

export type FindAllAscCentersInput = {
  page: number
  limit: number
  search: string
  sortBy: 'createdAt' | 'updatedAt' | 'centerName'
  sortOrder: 'asc' | 'desc'
  status?: 'active' | 'inactive' | 'suspended'
}

export class AscCenterService implements IAscCenterService {
  constructor(private readonly ascCenterRepository: IAscCenterRepository = new AscCenterRepository()) {}

  async findAll(query: FindAllAscCentersInput) {
    const where: Prisma.AscCenterWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { centerName: { contains: query.search, mode: 'insensitive' } },
              { centerCode: { contains: query.search, mode: 'insensitive' } },
              { companyName: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    }

    const [items, total] = await Promise.all([
      this.ascCenterRepository.findAll({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.sortBy]: query.sortOrder },
        select: ascCenterSelect,
      }),
      this.ascCenterRepository.count(where),
    ])

    return {
      items,
      pagination: buildPagination(query.page, query.limit, total),
    }
  }

  async findOneById(ascCenterId: string) {
    const found = await this.ascCenterRepository.findOneById(ascCenterId, {
      select: ascCenterSelect,
    })

    if (!found) {
      throw createOperationalError('ASC center not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    return found
  }

  async create(input: CreateAscCenterDto) {
    const duplicate = (await this.ascCenterRepository.findOneByCenterCode(input.centerCode, {
      select: { id: true },
    })) as { id: string } | null

    if (duplicate) {
      throw createOperationalError('ASC center code already exists', HTTP_RESPONSE_CODE.CONFLICT)
    }

    return this.ascCenterRepository.createOne(
      {
        centerName: input.centerName,
        centerCode: input.centerCode,
        companyName: input.companyName,
        region: input.region,
        email: input.email,
        address: input.address,
        ward: input.wardId ? { connect: { id: input.wardId } } : undefined,
        province: input.provinceId ? { connect: { id: input.provinceId } } : undefined,
        phone: input.phone,
        licenseNumber: input.licenseNumber,
        status: input.status,
      },
      { select: ascCenterSelect },
    )
  }

  async update(ascCenterId: string, input: ReplaceAscCenterDto | UpdateAscCenterDto) {
    const existing = (await this.ascCenterRepository.findOneById(ascCenterId, {
      select: { id: true, centerCode: true },
    })) as { id: string; centerCode: string } | null

    if (!existing) {
      throw createOperationalError('ASC center not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    if (input.centerCode !== undefined && input.centerCode !== existing.centerCode) {
      const duplicate = (await this.ascCenterRepository.findOneByCenterCode(input.centerCode, {
        select: { id: true },
      })) as { id: string } | null

      if (duplicate && duplicate.id !== ascCenterId) {
        throw createOperationalError('ASC center code already exists', HTTP_RESPONSE_CODE.CONFLICT)
      }
    }

    const data: Prisma.AscCenterUpdateInput = {}

    if (input.centerName !== undefined) data.centerName = input.centerName
    if (input.centerCode !== undefined) data.centerCode = input.centerCode
    if (input.companyName !== undefined) data.companyName = input.companyName
    if (input.region !== undefined) data.region = input.region
    if (input.email !== undefined) data.email = input.email
    if (input.address !== undefined) data.address = input.address
    if (input.wardId !== undefined) {
      data.ward = input.wardId ? { connect: { id: input.wardId } } : { disconnect: true }
    }
    if (input.provinceId !== undefined) {
      data.province = input.provinceId ? { connect: { id: input.provinceId } } : { disconnect: true }
    }
    if (input.phone !== undefined) data.phone = input.phone
    if (input.licenseNumber !== undefined) data.licenseNumber = input.licenseNumber
    if (input.status !== undefined) data.status = input.status

    if (Object.keys(data).length === 0) {
      throw createOperationalError('No fields to update', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }

    return this.ascCenterRepository.updateOneById(ascCenterId, data, { select: ascCenterSelect })
  }

  async delete(ascCenterId: string) {
    const existing = await this.ascCenterRepository.findOneById(ascCenterId, {
      select: { id: true },
    })

    if (!existing) {
      throw createOperationalError('ASC center not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    await this.ascCenterRepository.deleteById(ascCenterId)

    return { success: true as const }
  }
}
