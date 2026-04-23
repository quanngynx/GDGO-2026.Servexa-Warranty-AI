import type { CreateCustomerDto, ReplaceCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto'
import type { FindAllCustomersInput } from '../services/customer.service'

export interface ICustomerService {
  findAll(query: FindAllCustomersInput): Promise<unknown>
  findOneById(customerId: string): Promise<unknown>
  create(input: CreateCustomerDto): Promise<unknown>
  update(customerId: string, input: ReplaceCustomerDto | UpdateCustomerDto): Promise<unknown>
  delete(customerId: string): Promise<{ success: true }>
}
