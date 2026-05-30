import type {
  CreateEmployeeDto,
  LinkEmployeeUserDto,
  ReplaceEmployeeDto,
  UpdateEmployeeDto,
} from "../dtos/employee.dto";
import type { FindAllEmployeesInput } from "../services/employee.service";
import type { BasePagination } from "src/types/pagination";
import type { Prisma, Employee } from "@servexa-warranty-ai/db/prisma/client";

export interface IEmployeeService {
  findAll(query: FindAllEmployeesInput): Promise<{ items: (Employee & Prisma.EmployeeInclude)[] | null | undefined, pagination: BasePagination }>;
  findOneById(employeeId: string): Promise<Employee & Prisma.EmployeeInclude | null | undefined>;
  create(input: CreateEmployeeDto): Promise<unknown>;
  update(
    employeeId: string,
    input: ReplaceEmployeeDto | UpdateEmployeeDto,
  ): Promise<unknown>;
  linkUser(employeeId: string, input: LinkEmployeeUserDto): Promise<unknown>;
  delete(employeeId: string): Promise<{ success: true }>;
}
