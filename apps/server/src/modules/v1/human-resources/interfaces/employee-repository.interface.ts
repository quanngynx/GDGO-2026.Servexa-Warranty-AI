import type { Employee, Prisma } from "@servexa-warranty-ai/db/prisma/client";

type EmployeeSelect = Prisma.EmployeeSelect;
type EmployeeInclude = Prisma.EmployeeInclude;
type EmployeeOptions<
  TSelect extends EmployeeSelect | undefined,
  TInclude extends EmployeeInclude | undefined,
> = {
  select?: TSelect;
  include?: TInclude;
};

export interface IEmployeeRepository {
  findAll(
    query: Prisma.EmployeeFindManyArgs,
  ): Promise<(Employee[] & Prisma.EmployeeInclude) | null | undefined>;
  count(where: Prisma.EmployeeWhereInput): Promise<number>;
  findOneById<
    TSelect extends EmployeeSelect | undefined,
    TInclude extends EmployeeInclude | undefined,
  >(
    id: string,
    options?: EmployeeOptions<TSelect, TInclude>,
  ): Promise<(Employee & Prisma.EmployeeInclude) | null | undefined>;
  findOneByEmployeeCode<
    TSelect extends EmployeeSelect | undefined,
    TInclude extends EmployeeInclude | undefined,
  >(
    code: string,
    options?: EmployeeOptions<TSelect, TInclude>,
  ): Promise<Employee | null>;
  findOneByEmail<
    TSelect extends EmployeeSelect | undefined,
    TInclude extends EmployeeInclude | undefined,
  >(
    email: string,
    options?: EmployeeOptions<TSelect, TInclude>,
  ): Promise<Employee | null>;
  findOneByNationalId<
    TSelect extends EmployeeSelect | undefined,
    TInclude extends EmployeeInclude | undefined,
  >(
    nationalId: string,
    options?: EmployeeOptions<TSelect, TInclude>,
  ): Promise<Employee | null>;
  findOneByUserId<
    TSelect extends EmployeeSelect | undefined,
    TInclude extends EmployeeInclude | undefined,
  >(
    userId: string,
    options?: EmployeeOptions<TSelect, TInclude>,
  ): Promise<Employee | null>;
  createOne<
    TSelect extends EmployeeSelect | undefined,
    TInclude extends EmployeeInclude | undefined,
  >(
    data: Prisma.EmployeeCreateInput,
    options?: EmployeeOptions<TSelect, TInclude>,
  ): Promise<unknown>;
  updateOneById<
    TSelect extends EmployeeSelect | undefined,
    TInclude extends EmployeeInclude | undefined,
  >(
    id: string,
    data: Prisma.EmployeeUpdateInput,
    options?: EmployeeOptions<TSelect, TInclude>,
  ): Promise<unknown>;
  deleteById(id: string): Promise<unknown>;
}
