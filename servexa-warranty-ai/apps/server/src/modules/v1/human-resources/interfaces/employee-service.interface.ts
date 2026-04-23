import type { CreateEmployeeDto, LinkEmployeeUserDto, ReplaceEmployeeDto, UpdateEmployeeDto } from '../dtos/employee.dto'
import type { FindAllEmployeesInput } from '../services/employee.service'

export interface IEmployeeService {
  findAll(query: FindAllEmployeesInput): Promise<unknown>
  findOneById(employeeId: string): Promise<unknown>
  create(input: CreateEmployeeDto): Promise<unknown>
  update(employeeId: string, input: ReplaceEmployeeDto | UpdateEmployeeDto): Promise<unknown>
  linkUser(employeeId: string, input: LinkEmployeeUserDto): Promise<unknown>
  delete(employeeId: string): Promise<{ success: true }>
}
