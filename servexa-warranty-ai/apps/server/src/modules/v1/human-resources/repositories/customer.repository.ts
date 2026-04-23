import prisma from '@servexa-warranty-ai/db'
import type { Prisma } from '@servexa-warranty-ai/db/prisma/client'

import type { ICustomerRepository } from '../interfaces/customer-repository.interface'

type CustomerSelect = Prisma.CustomerSelect
type CustomerInclude = Prisma.CustomerInclude
type CustomerOptions<TSelect extends CustomerSelect | undefined, TInclude extends CustomerInclude | undefined> = {
  select?: TSelect
  include?: TInclude
}

export class CustomerRepository implements ICustomerRepository {
  async findAll(query: Prisma.CustomerFindManyArgs) {
    const { take, skip, where, orderBy, ...rest } = query
    return prisma.customer.findMany({
      take,
      skip,
      where,
      orderBy,
      ...rest,
    })
  }

  async count(where: Prisma.CustomerWhereInput) {
    return prisma.customer.count({ where })
  }

  async findOneById<TSelect extends CustomerSelect | undefined, TInclude extends CustomerInclude | undefined>(
    id: string,
    options?: CustomerOptions<TSelect, TInclude>,
  ) {
    return prisma.customer.findUnique({
      where: { id },
      ...options,
    })
  }

  async findOneByPhone<TSelect extends CustomerSelect | undefined, TInclude extends CustomerInclude | undefined>(
    phone: string,
    options?: CustomerOptions<TSelect, TInclude>,
  ) {
    return prisma.customer.findFirst({
      where: {
        OR: [{ phone1: phone }, { phone2: phone }],
      },
      ...options,
    })
  }

  async createOne<TSelect extends CustomerSelect | undefined, TInclude extends CustomerInclude | undefined>(
    data: Prisma.CustomerCreateInput,
    options?: CustomerOptions<TSelect, TInclude>,
  ) {
    return prisma.customer.create({
      data,
      ...options,
    })
  }

  async updateOneById<TSelect extends CustomerSelect | undefined, TInclude extends CustomerInclude | undefined>(
    id: string,
    data: Prisma.CustomerUpdateInput,
    options?: CustomerOptions<TSelect, TInclude>,
  ) {
    return prisma.customer.update({
      where: { id },
      data,
      ...options,
    })
  }

  async deleteById(id: string) {
    return prisma.customer.delete({
      where: { id },
    })
  }
}
