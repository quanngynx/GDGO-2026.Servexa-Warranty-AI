import type { Customer, Prisma } from "@servexa-warranty-ai/db/prisma/client";
import type {
  CreateCustomerDto,
  ReplaceCustomerDto,
  UpdateCustomerDto,
} from "../dtos/customer.dto";
import type { FindAllCustomersInput } from "../services/customer.service";
import type { BasePagination } from "src/types/pagination";

export interface ICustomerService {
  findAll(
    query: FindAllCustomersInput,
  ): Promise<{ items: (Customer & Prisma.CustomerInclude)[] | null | undefined; pagination: BasePagination }>;
  findOneById(
    customerId: string,
  ): Promise<(Customer & Prisma.CustomerInclude) | null | undefined>;
  create(input: CreateCustomerDto): Promise<unknown>;
  update(
    customerId: string,
    input: ReplaceCustomerDto | UpdateCustomerDto,
  ): Promise<unknown>;
  delete(customerId: string): Promise<{ success: true }>;
}
