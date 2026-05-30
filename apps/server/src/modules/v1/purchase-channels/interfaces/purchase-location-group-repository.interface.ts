import type { Prisma } from '@servexa-warranty-ai/db/prisma/client'

export type PurchaseLocationGroupOptions<
  TSelect extends Prisma.PurchaseLocationGroupSelect | undefined,
  TInclude extends Prisma.PurchaseLocationGroupInclude | undefined,
> = {
  select?: TSelect
  include?: TInclude
}

export interface IPurchaseLocationGroupRepository {
  findAll(query: Prisma.PurchaseLocationGroupFindManyArgs): Promise<unknown[]>
  count(where: Prisma.PurchaseLocationGroupWhereInput): Promise<number>
  findOneById<
    TSelect extends Prisma.PurchaseLocationGroupSelect | undefined,
    TInclude extends Prisma.PurchaseLocationGroupInclude | undefined,
  >(
    id: string,
    options?: PurchaseLocationGroupOptions<TSelect, TInclude>,
  ): Promise<unknown | null>
  findOneByCode<
    TSelect extends Prisma.PurchaseLocationGroupSelect | undefined,
    TInclude extends Prisma.PurchaseLocationGroupInclude | undefined,
  >(
    code: string,
    options?: PurchaseLocationGroupOptions<TSelect, TInclude>,
  ): Promise<unknown | null>
  createOne<
    TSelect extends Prisma.PurchaseLocationGroupSelect | undefined,
    TInclude extends Prisma.PurchaseLocationGroupInclude | undefined,
  >(
    data: Prisma.PurchaseLocationGroupCreateInput,
    options?: PurchaseLocationGroupOptions<TSelect, TInclude>,
  ): Promise<unknown>
  updateOneById<
    TSelect extends Prisma.PurchaseLocationGroupSelect | undefined,
    TInclude extends Prisma.PurchaseLocationGroupInclude | undefined,
  >(
    id: string,
    data: Prisma.PurchaseLocationGroupUpdateInput,
    options?: PurchaseLocationGroupOptions<TSelect, TInclude>,
  ): Promise<unknown>
  deleteById(id: string): Promise<unknown>
}
