import type { Prisma } from '@servexa-warranty-ai/db/prisma/client'

type CustomerSelect = Prisma.CustomerSelect
type CustomerInclude = Prisma.CustomerInclude
type CustomerOptions<TSelect extends CustomerSelect | undefined, TInclude extends CustomerInclude | undefined> = {
  select?: TSelect
  include?: TInclude
}

export interface ICustomerRepository {
  findAll(query: Prisma.CustomerFindManyArgs): Promise<unknown[]>
  count(where: Prisma.CustomerWhereInput): Promise<number>
  findOneById<TSelect extends CustomerSelect | undefined, TInclude extends CustomerInclude | undefined>(
    id: string,
    options?: CustomerOptions<TSelect, TInclude>,
  ): Promise<unknown | null>
  findOneByPhone<TSelect extends CustomerSelect | undefined, TInclude extends CustomerInclude | undefined>(
    phone: string,
    options?: CustomerOptions<TSelect, TInclude>,
  ): Promise<unknown | null>
  createOne<TSelect extends CustomerSelect | undefined, TInclude extends CustomerInclude | undefined>(
    data: Prisma.CustomerCreateInput,
    options?: CustomerOptions<TSelect, TInclude>,
  ): Promise<unknown>
  updateOneById<TSelect extends CustomerSelect | undefined, TInclude extends CustomerInclude | undefined>(
    id: string,
    data: Prisma.CustomerUpdateInput,
    options?: CustomerOptions<TSelect, TInclude>,
  ): Promise<unknown>
  deleteById(id: string): Promise<unknown>
}
