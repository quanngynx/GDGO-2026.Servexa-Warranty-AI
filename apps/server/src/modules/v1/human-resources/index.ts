export type { CreateCustomerDto, ReplaceCustomerDto, UpdateCustomerDto } from './dtos/customer.dto'
export type {
  CreateEmployeeDto,
  LinkEmployeeUserDto,
  ReplaceEmployeeDto,
  UpdateEmployeeDto,
} from './dtos/employee.dto'
export type { CreateTechnicianDto, ReplaceTechnicianDto, UpdateTechnicianDto } from './dtos/technician.dto'

export type { ICustomerRepository } from './interfaces/customer-repository.interface'
export type { IEmployeeRepository } from './interfaces/employee-repository.interface'
export type { ITechnicianRepository } from './interfaces/technician-repository.interface'
export type { ICustomerService } from './interfaces/customer-service.interface'
export type { IEmployeeService } from './interfaces/employee-service.interface'
export type { ITechnicianService } from './interfaces/technician-service.interface'

export type { FindAllCustomersInput } from './services/customer.service'
export type { FindAllEmployeesInput } from './services/employee.service'
export type { FindAllTechniciansInput } from './services/technician.service'
