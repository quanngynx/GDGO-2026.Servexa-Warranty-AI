import prisma from '@servexa-warranty-ai/db'
import { Prisma } from '@servexa-warranty-ai/db/prisma/client'

import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { createOperationalError } from '@/middlewares/error-middleware'
import { buildPagination } from '@/utils/pagination'

import type {
  CreateEmployeeDto,
  LinkEmployeeUserDto,
  ReplaceEmployeeDto,
  UpdateEmployeeDto,
} from '../dtos/employee.dto'
import type { IEmployeeRepository } from '../interfaces/employee-repository.interface'
import type { IEmployeeService } from '../interfaces/employee-service.interface'
import { EmployeeRepository } from '../repositories/employee.repository'

const employeeSelect = {
  id: true,
  employeeCode: true,
  gender: true,
  fullName: true,
  dateOfBirth: true,
  primaryPhone: true,
  secondaryPhone: true,
  email: true,
  permanentAddress: true,
  avatar: true,
  department: true,
  position: true,
  startDate: true,
  ascCenterId: true,
  baseSalary: true,
  status: true,
  nationalId: true,
  idIssueDate: true,
  idAddress: true,
  idIssuingAuthority: true,
  bankAccount: true,
  taxId: true,
  bankName: true,
  emergencyContactName: true,
  emergencyContactPhone: true,
  userId: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
} satisfies Prisma.EmployeeSelect

export type FindAllEmployeesInput = {
  page: number
  limit: number
  search: string
  sortBy: 'createdAt' | 'updatedAt' | 'fullName' | 'employeeCode'
  sortOrder: 'asc' | 'desc'
  status?: 'active' | 'resigned' | 'on_leave'
  department?: 'technical' | 'coordination'
  position?:
    | 'supervisor'
    | 'receptionist'
    | 'home_appliance_technician'
    | 'home_service_technician'
    | 'workshop_technician'
    | 'warehouse_staff'
  ascCenterId?: string
}

export class EmployeeService implements IEmployeeService {
  constructor(private readonly employeeRepository: IEmployeeRepository = new EmployeeRepository()) {}

  private async ensureReferences(input: { ascCenterId?: string; userId?: string; createdBy?: string }) {
    if (input.ascCenterId) {
      const found = await prisma.ascCenter.findUnique({ where: { id: input.ascCenterId }, select: { id: true } })
      if (!found) throw createOperationalError('ASC center not found', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }
    if (input.userId) {
      const found = await prisma.user.findUnique({ where: { id: input.userId }, select: { id: true } })
      if (!found) throw createOperationalError('User not found', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }
    if (input.createdBy) {
      const found = await prisma.user.findUnique({ where: { id: input.createdBy }, select: { id: true } })
      if (!found) throw createOperationalError('Creator not found', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }
  }

  private async ensureUniqueConstraints(
    input: { employeeCode?: string; email?: string; nationalId?: string; userId?: string },
    excludeEmployeeId?: string,
  ) {
    if (input.employeeCode) {
      const found = (await this.employeeRepository.findOneByEmployeeCode(input.employeeCode, {
        select: { id: true },
      })) as { id: string } | null
      if (found && found.id !== excludeEmployeeId) {
        throw createOperationalError('Employee code already exists', HTTP_RESPONSE_CODE.CONFLICT)
      }
    }
    if (input.email) {
      const found = (await this.employeeRepository.findOneByEmail(input.email, {
        select: { id: true },
      })) as { id: string } | null
      if (found && found.id !== excludeEmployeeId) {
        throw createOperationalError('Email already exists', HTTP_RESPONSE_CODE.CONFLICT)
      }
    }
    if (input.nationalId) {
      const found = (await this.employeeRepository.findOneByNationalId(input.nationalId, {
        select: { id: true },
      })) as { id: string } | null
      if (found && found.id !== excludeEmployeeId) {
        throw createOperationalError('National ID already exists', HTTP_RESPONSE_CODE.CONFLICT)
      }
    }
    if (input.userId) {
      const found = (await this.employeeRepository.findOneByUserId(input.userId, {
        select: { id: true },
      })) as { id: string } | null
      if (found && found.id !== excludeEmployeeId) {
        throw createOperationalError('User is already linked to another employee', HTTP_RESPONSE_CODE.CONFLICT)
      }
    }
  }

  async findAll(query: FindAllEmployeesInput) {
    const where: Prisma.EmployeeWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.department ? { department: query.department } : {}),
      ...(query.position ? { position: query.position } : {}),
      ...(query.ascCenterId ? { ascCenterId: query.ascCenterId } : {}),
      ...(query.search
        ? {
            OR: [
              { fullName: { contains: query.search, mode: 'insensitive' } },
              { employeeCode: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
              { primaryPhone: { contains: query.search, mode: 'insensitive' } },
              { nationalId: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    }

    const [items, total] = await Promise.all([
      this.employeeRepository.findAll({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.sortBy]: query.sortOrder },
        select: employeeSelect,
        include: {
          ascCenter: {
            select: {
              centerName: true,
              centerCode: true,
              address: true,
            },
          },
          user: {
            select: {
              username: true,
              status: true,
            },
          },
          creator: {
            select: {
              fullName: true,
              username: true,
            },
          },
          _count: {
            select: {
              repairCasesAssigned: true,
            },
          },
        },
      }),
      this.employeeRepository.count(where),
    ])

    return { items, pagination: buildPagination(query.page, query.limit, total) }
  }

  async findOneById(employeeId: string) {
    const found = await this.employeeRepository.findOneById(employeeId, {
      select: employeeSelect,
      include: {
        ascCenter: true,
          user: {
            select: {
              username: true,
              status: true,
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
          creator: {
            select: {
              fullName: true,
              username: true,
            },
          },
          repairCasesAssigned: {
            select: {
              caseNumber: true,
              status: true,
              customer: {
                select: {
                  fullName: true,
                },
              },
              receivedDate: true,
            },
            orderBy: { receivedDate: "desc" },
            take: 10,
          },
          _count: {
            select: {
              repairCasesAssigned: true,
            },
          },
      }
    })

    if (!found) throw createOperationalError('Employee not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    return found
  }

  async create(input: CreateEmployeeDto) {
    await this.ensureReferences({ ascCenterId: input.ascCenterId, userId: input.userId, createdBy: input.createdBy })
    await this.ensureUniqueConstraints({
      employeeCode: input.employeeCode,
      email: input.email,
      nationalId: input.nationalId,
      userId: input.userId,
    })

    return this.employeeRepository.createOne(
      {
        employeeCode: input.employeeCode,
        gender: input.gender,
        fullName: input.fullName,
        dateOfBirth: input.dateOfBirth,
        primaryPhone: input.primaryPhone,
        secondaryPhone: input.secondaryPhone,
        email: input.email,
        permanentAddress: input.permanentAddress,
        avatar: input.avatar,
        department: input.department,
        position: input.position,
        startDate: input.startDate,
        ascCenter: { connect: { id: input.ascCenterId } },
        baseSalary:
          input.baseSalary === undefined || input.baseSalary === null
            ? null
            : new Prisma.Decimal(input.baseSalary),
        status: input.status ?? 'active',
        nationalId: input.nationalId,
        idIssueDate: input.idIssueDate,
        idAddress: input.idAddress,
        idIssuingAuthority: input.idIssuingAuthority,
        bankAccount: input.bankAccount,
        taxId: input.taxId,
        bankName: input.bankName,
        emergencyContactName: input.emergencyContactName,
        emergencyContactPhone: input.emergencyContactPhone,
        user: input.userId ? { connect: { id: input.userId } } : undefined,
        notes: input.notes,
        creator: { connect: { id: input.createdBy } },
      },
      { select: employeeSelect },
    )
  }

  async update(employeeId: string, input: ReplaceEmployeeDto | UpdateEmployeeDto) {
    await this.findOneById(employeeId)
    await this.ensureReferences({
      ascCenterId: input.ascCenterId,
      userId: input.userId,
      createdBy: input.createdBy,
    })
    await this.ensureUniqueConstraints(
      {
        employeeCode: input.employeeCode,
        email: input.email,
        nationalId: input.nationalId,
        userId: input.userId,
      },
      employeeId,
    )

    const data: Prisma.EmployeeUpdateInput = {}
    if (input.employeeCode !== undefined) data.employeeCode = input.employeeCode
    if (input.gender !== undefined) data.gender = input.gender
    if (input.fullName !== undefined) data.fullName = input.fullName
    if (input.dateOfBirth !== undefined) data.dateOfBirth = input.dateOfBirth
    if (input.primaryPhone !== undefined) data.primaryPhone = input.primaryPhone
    if (input.secondaryPhone !== undefined) data.secondaryPhone = input.secondaryPhone
    if (input.email !== undefined) data.email = input.email
    if (input.permanentAddress !== undefined) data.permanentAddress = input.permanentAddress
    if (input.avatar !== undefined) data.avatar = input.avatar
    if (input.department !== undefined) data.department = input.department
    if (input.position !== undefined) data.position = input.position
    if (input.startDate !== undefined) data.startDate = input.startDate
    if (input.ascCenterId !== undefined) data.ascCenter = { connect: { id: input.ascCenterId } }
    if (input.baseSalary !== undefined) {
      data.baseSalary =
        input.baseSalary === null ? null : new Prisma.Decimal(input.baseSalary)
    }
    if (input.status !== undefined) data.status = input.status
    if (input.nationalId !== undefined) data.nationalId = input.nationalId
    if (input.idIssueDate !== undefined) data.idIssueDate = input.idIssueDate
    if (input.idAddress !== undefined) data.idAddress = input.idAddress
    if (input.idIssuingAuthority !== undefined) data.idIssuingAuthority = input.idIssuingAuthority
    if (input.bankAccount !== undefined) data.bankAccount = input.bankAccount
    if (input.taxId !== undefined) data.taxId = input.taxId
    if (input.bankName !== undefined) data.bankName = input.bankName
    if (input.emergencyContactName !== undefined) data.emergencyContactName = input.emergencyContactName
    if (input.emergencyContactPhone !== undefined) data.emergencyContactPhone = input.emergencyContactPhone
    if (input.userId !== undefined) data.user = input.userId ? { connect: { id: input.userId } } : { disconnect: true }
    if (input.notes !== undefined) data.notes = input.notes
    if (input.createdBy !== undefined) data.creator = { connect: { id: input.createdBy } }

    if (Object.keys(data).length === 0) {
      throw createOperationalError('No fields to update', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }

    return this.employeeRepository.updateOneById(employeeId, data, { select: employeeSelect })
  }

  async linkUser(employeeId: string, input: LinkEmployeeUserDto) {
    await this.findOneById(employeeId)
    await this.ensureReferences({ userId: input.userId })
    await this.ensureUniqueConstraints({ userId: input.userId }, employeeId)
    return this.employeeRepository.updateOneById(
      employeeId,
      { user: { connect: { id: input.userId } } },
      { select: employeeSelect },
    )
  }

  async delete(employeeId: string) {
    await this.findOneById(employeeId)
    await this.employeeRepository.deleteById(employeeId)
    return { success: true as const }
  }
}
