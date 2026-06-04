import prisma from "@/core/infra/prisma";
import { Prisma, type Employee } from "@/core/infra/prisma/generated/client";

import type { IEmployeeRepository } from "../interfaces/employee-repository.interface";

type EmployeeSelect = Prisma.EmployeeSelect;
type EmployeeInclude = Prisma.EmployeeInclude;
type EmployeeOptions<
  TSelect extends EmployeeSelect | undefined,
  TInclude extends EmployeeInclude | undefined,
> = {
  select?: TSelect;
  include?: TInclude;
};

export class EmployeeRepository implements IEmployeeRepository {
  async findAll(
    query: Prisma.EmployeeFindManyArgs,
  ): Promise<Employee[] | null | undefined> {
    const { take, skip, where, orderBy, ...rest } = query;
    return prisma.employee.findMany({
      take,
      skip,
      where,
      orderBy,
      ...rest,
    });
  }

  async count(where: Prisma.EmployeeWhereInput) {
    return prisma.employee.count({ where });
  }

  async findOneById<
    TSelect extends EmployeeSelect | undefined,
    TInclude extends EmployeeInclude | undefined,
  >(
    id: string,
    options?: EmployeeOptions<TSelect, TInclude>,
  ): Promise<(Employee & Prisma.EmployeeInclude) | null | undefined> {
    return prisma.employee.findUnique({
      where: { id },
      ...options,
    });
  }

  async findOneByEmployeeCode<
    TSelect extends EmployeeSelect | undefined,
    TInclude extends EmployeeInclude | undefined,
  >(
    code: string,
    options?: EmployeeOptions<TSelect, TInclude>,
  ): Promise<Employee | null> {
    return prisma.employee.findUnique({
      where: { employeeCode: code },
      ...options,
    });
  }

  async findOneByEmail<
    TSelect extends EmployeeSelect | undefined,
    TInclude extends EmployeeInclude | undefined,
  >(
    email: string,
    options?: EmployeeOptions<TSelect, TInclude>,
  ): Promise<Employee | null> {
    return prisma.employee.findUnique({
      where: { email },
      ...options,
    });
  }

  async findOneByNationalId<
    TSelect extends EmployeeSelect | undefined,
    TInclude extends EmployeeInclude | undefined,
  >(
    nationalId: string,
    options?: EmployeeOptions<TSelect, TInclude>,
  ): Promise<Employee | null> {
    return prisma.employee.findUnique({
      where: { nationalId },
      ...options,
    });
  }

  async findOneByUserId<
    TSelect extends EmployeeSelect | undefined,
    TInclude extends EmployeeInclude | undefined,
  >(
    userId: string,
    options?: EmployeeOptions<TSelect, TInclude>,
  ): Promise<Employee | null> {
    return prisma.employee.findFirst({
      where: { userId },
      ...options,
    });
  }

  async createOne<
    TSelect extends EmployeeSelect | undefined,
    TInclude extends EmployeeInclude | undefined,
  >(
    data: Prisma.EmployeeCreateInput,
    options?: EmployeeOptions<TSelect, TInclude>,
  ): Promise<Employee & Prisma.EmployeeInclude> {
    return prisma.employee.create({
      data,
      ...options,
    });
  }

  async updateOneById<
    TSelect extends EmployeeSelect | undefined,
    TInclude extends EmployeeInclude | undefined,
  >(
    id: string,
    data: Prisma.EmployeeUpdateInput,
    options?: EmployeeOptions<TSelect, TInclude>,
  ): Promise<Employee & Prisma.EmployeeInclude> {
    return prisma.employee.update({
      where: { id },
      data,
      ...options,
    });
  }

  async deleteById(id: string): Promise<Employee & Prisma.EmployeeInclude> {
    return prisma.employee.delete({
      where: { id },
    });
  }
}
