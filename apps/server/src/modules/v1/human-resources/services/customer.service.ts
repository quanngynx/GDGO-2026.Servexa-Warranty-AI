import prisma from '@/core/infra/prisma'
import { Prisma } from '@/core/infra/prisma/generated/client'

import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { createOperationalError } from '@/middlewares/error-middleware'
import { buildPagination } from '@/utils/pagination'

import type { CreateCustomerDto, ReplaceCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto'
import type { ICustomerRepository } from '../interfaces/customer-repository.interface'
import type { ICustomerService } from '../interfaces/customer-service.interface'
import { CustomerRepository } from '../repositories/customer.repository'

const customerSelect = {
  id: true,
  customerGroup: true,
  fullName: true,
  phone1: true,
  phone2: true,
  email: true,
  provinceId: true,
  wardId: true,
  address: true,
  taxCode: true,
  bankName: true,
  accountNumber: true,
  contactPerson: true,
  ascCenterId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CustomerSelect

export type FindAllCustomersInput = {
  page: number
  limit: number
  search: string
  sortBy: 'createdAt' | 'updatedAt' | 'fullName' | 'phone1'
  sortOrder: 'asc' | 'desc'
  customerGroup?: 'individual' | 'dealer_store' | 'store_representative' | 'supplier' | 'invoice' | 'company'
  ascCenterId?: string
}

export class CustomerService implements ICustomerService {
  constructor(private readonly customerRepository: ICustomerRepository = new CustomerRepository()) {}

  private async ensureForeignKeys(input: { provinceId?: string; wardId?: string; ascCenterId?: string }) {
    if (input.provinceId) {
      const found = await prisma.province.findUnique({ where: { id: input.provinceId }, select: { id: true } })
      if (!found) throw createOperationalError('Province not found', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }
    if (input.wardId) {
      const found = await prisma.ward.findUnique({ where: { id: input.wardId }, select: { id: true } })
      if (!found) throw createOperationalError('Ward not found', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }
    if (input.ascCenterId) {
      const found = await prisma.ascCenter.findUnique({ where: { id: input.ascCenterId }, select: { id: true } })
      if (!found) throw createOperationalError('ASC center not found', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }
  }

  async findAll(query: FindAllCustomersInput) {
    const where: Prisma.CustomerWhereInput = {
      ...(query.customerGroup ? { customerGroup: query.customerGroup } : {}),
      ...(query.ascCenterId ? { ascCenterId: query.ascCenterId } : {}),
      ...(query.search
        ? {
            OR: [
              { fullName: { contains: query.search, mode: 'insensitive' } },
              { phone1: { contains: query.search, mode: 'insensitive' } },
              { phone2: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    }

    const [items, total] = await Promise.all([
      this.customerRepository.findAll({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.sortBy]: query.sortOrder },
        select: customerSelect,
        include: {
          province: {
            select: {
              name: true,
              code: true,
            }
          },
          ward: {
            select: {
              name: true,
              code: true,
            }
          },
          ascCenter: {
            select: {
              centerName: true,
              centerCode: true,
            }
          },
          repairCases: {
            select: {
              caseNumber: true,
              status: true,
              createdAt: true,
              totalCost: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          _count: {
            select: {
              repairCases: true,
            }
          }
        }
      }),
      this.customerRepository.count(where),
    ])

    return { items, pagination: buildPagination(query.page, query.limit, total) }
  }

  async findOneById(customerId: string) {
    const found = await this.customerRepository.findOneById(customerId, {
      select: customerSelect,
    })

    if (!found) throw createOperationalError('Customer not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    return found
  }

  async create(input: CreateCustomerDto) {
    await this.ensureForeignKeys(input)
    return this.customerRepository.createOne(
      {
        customerGroup: input.customerGroup,
        fullName: input.fullName,
        phone1: input.phone1,
        phone2: input.phone2,
        email: input.email,
        province: input.provinceId ? { connect: { id: input.provinceId } } : undefined,
        ward: input.wardId ? { connect: { id: input.wardId } } : undefined,
        address: input.address,
        taxCode: input.taxCode,
        bankName: input.bankName,
        accountNumber: input.accountNumber,
        contactPerson: input.contactPerson,
        ascCenter: input.ascCenterId ? { connect: { id: input.ascCenterId } } : undefined,
      },
      { select: customerSelect },
    )
  }

  async update(customerId: string, input: ReplaceCustomerDto | UpdateCustomerDto) {
    await this.findOneById(customerId)
    await this.ensureForeignKeys(input)

    const data: Prisma.CustomerUpdateInput = {}
    if (input.customerGroup !== undefined) data.customerGroup = input.customerGroup
    if (input.fullName !== undefined) data.fullName = input.fullName
    if (input.phone1 !== undefined) data.phone1 = input.phone1
    if (input.phone2 !== undefined) data.phone2 = input.phone2
    if (input.email !== undefined) data.email = input.email
    if (input.provinceId !== undefined) data.province = input.provinceId ? { connect: { id: input.provinceId } } : { disconnect: true }
    if (input.wardId !== undefined) data.ward = input.wardId ? { connect: { id: input.wardId } } : { disconnect: true }
    if (input.address !== undefined) data.address = input.address
    if (input.taxCode !== undefined) data.taxCode = input.taxCode
    if (input.bankName !== undefined) data.bankName = input.bankName
    if (input.accountNumber !== undefined) data.accountNumber = input.accountNumber
    if (input.contactPerson !== undefined) data.contactPerson = input.contactPerson
    if (input.ascCenterId !== undefined) data.ascCenter = input.ascCenterId ? { connect: { id: input.ascCenterId } } : { disconnect: true }

    if (Object.keys(data).length === 0) {
      throw createOperationalError('No fields to update', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }

    return this.customerRepository.updateOneById(
      customerId,
      data,
      { select: customerSelect },
    )
  }

  async delete(customerId: string) {
    await this.findOneById(customerId)
    await this.customerRepository.deleteById(customerId)
    return { success: true as const }
  }
}
