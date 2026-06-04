import { Prisma } from '@/core/infra/prisma/generated/client'

export type PurchaseLocationOptions<
  TSelect extends Prisma.PurchaseLocationSelect | undefined,
  TInclude extends Prisma.PurchaseLocationInclude | undefined,
> = {
  select?: TSelect
  include?: TInclude
}

export interface IPurchaseLocationRepository {
  findAll(query: Prisma.PurchaseLocationFindManyArgs): Promise<unknown[]>
  count(where: Prisma.PurchaseLocationWhereInput): Promise<number>
  findOneById<
    TSelect extends Prisma.PurchaseLocationSelect | undefined,
    TInclude extends Prisma.PurchaseLocationInclude | undefined,
  >(
    id: string,
    options?: PurchaseLocationOptions<TSelect, TInclude>,
  ): Promise<unknown | null>
  findOneByCode<
    TSelect extends Prisma.PurchaseLocationSelect | undefined,
    TInclude extends Prisma.PurchaseLocationInclude | undefined,
  >(
    code: string,
    options?: PurchaseLocationOptions<TSelect, TInclude>,
  ): Promise<unknown | null>
  findOneByGroupAndCode<
    TSelect extends Prisma.PurchaseLocationSelect | undefined,
    TInclude extends Prisma.PurchaseLocationInclude | undefined,
  >(
    groupId: string,
    code: string,
    options?: PurchaseLocationOptions<TSelect, TInclude>,
  ): Promise<unknown | null>
  createOne<
    TSelect extends Prisma.PurchaseLocationSelect | undefined,
    TInclude extends Prisma.PurchaseLocationInclude | undefined,
  >(
    data: Prisma.PurchaseLocationCreateInput,
    options?: PurchaseLocationOptions<TSelect, TInclude>,
  ): Promise<unknown>
  updateOneById<
    TSelect extends Prisma.PurchaseLocationSelect | undefined,
    TInclude extends Prisma.PurchaseLocationInclude | undefined,
  >(
    id: string,
    data: Prisma.PurchaseLocationUpdateInput,
    options?: PurchaseLocationOptions<TSelect, TInclude>,
  ): Promise<unknown>
  deleteById(id: string): Promise<unknown>
}
