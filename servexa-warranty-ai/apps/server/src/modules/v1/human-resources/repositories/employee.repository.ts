import prisma from '@servexa-warranty-ai/db'
import type { Prisma } from '@servexa-warranty-ai/db/prisma/client'

import type { IEmployeeRepository } from '../interfaces/employee-repository.interface'

type EmployeeSelect = Prisma.EmployeeSelect
type EmployeeInclude = Prisma.EmployeeInclude
type EmployeeOptions<TSelect extends EmployeeSelect | undefined, TInclude extends EmployeeInclude | undefined> = {
  select?: TSelect
  include?: TInclude
}

export class EmployeeRepository implements IEmployeeRepository {
  async findAll(query: Prisma.EmployeeFindManyArgs) {
    const { take, skip, where, orderBy, ...rest } = query
    return prisma.employee.findMany({
      take,
      skip,
      where,
      orderBy,
      ...rest,
    })
  }

  async count(where: Prisma.EmployeeWhereInput) {
    return prisma.employee.count({ where })
  }

  async findOneById<TSelect extends EmployeeSelect | undefined, TInclude extends EmployeeInclude | undefined>(
    id: string,
    options?: EmployeeOptions<TSelect, TInclude>,
  ) {
    return prisma.employee.findUnique({
      where: { id },
      ...options,
    })
  }

  async findOneByEmployeeCode<TSelect extends EmployeeSelect | undefined, TInclude extends EmployeeInclude | undefined>(
    code: string,
    options?: EmployeeOptions<TSelect, TInclude>,
  ) {
    return prisma.employee.findUnique({
      where: { employeeCode: code },
      ...options,
    })
  }

  async findOneByEmail<TSelect extends EmployeeSelect | undefined, TInclude extends EmployeeInclude | undefined>(
    email: string,
    options?: EmployeeOptions<TSelect, TInclude>,
  ) {
    return prisma.employee.findUnique({
      where: { email },
      ...options,
    })
  }

  async findOneByNationalId<
    TSelect extends EmployeeSelect | undefined,
    TInclude extends EmployeeInclude | undefined
  >(
    nationalId: string,
    options?: EmployeeOptions<TSelect, TInclude>,
  ) {
    return prisma.employee.findUnique({
      where: { nationalId },
      ...options,
    })
  }

  async findOneByUserId<TSelect extends EmployeeSelect | undefined, TInclude extends EmployeeInclude | undefined>(
    userId: string,
    options?: EmployeeOptions<TSelect, TInclude>,
  ) {
    return prisma.employee.findFirst({
      where: { userId },
      ...options,
    })
  }

  async createOne<TSelect extends EmployeeSelect | undefined, TInclude extends EmployeeInclude | undefined>(
    data: Prisma.EmployeeCreateInput,
    options?: EmployeeOptions<TSelect, TInclude>,
  ) {
    return prisma.employee.create({
      data,
      ...options,
    })
  }

  async updateOneById<TSelect extends EmployeeSelect | undefined, TInclude extends EmployeeInclude | undefined>(
    id: string,
    data: Prisma.EmployeeUpdateInput,
    options?: EmployeeOptions<TSelect, TInclude>,
  ) {
    return prisma.employee.update({
      where: { id },
      data,
      ...options,
    })
  }

  async deleteById(id: string) {
    return prisma.employee.delete({
      where: { id },
    })
  }
}
