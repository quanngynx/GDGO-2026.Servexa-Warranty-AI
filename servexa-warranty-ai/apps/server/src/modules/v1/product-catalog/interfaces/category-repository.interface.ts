import type { Category, Prisma } from '@servexa-warranty-ai/db/prisma/client'

type CategorySelect = Prisma.CategorySelect
type CategoryInclude = Prisma.CategoryInclude

export type CategoryOptions<
  TSelect extends CategorySelect | undefined,
  TInclude extends CategoryInclude | undefined,
> = {
  select?: TSelect
  include?: TInclude
}

export interface ICategoryRepository {
  findAll(query: Prisma.CategoryFindManyArgs): Promise<(Category & Prisma.CategoryInclude)[] | null>
  count(where: Prisma.CategoryWhereInput): Promise<number>
  findOneById<TSelect extends CategorySelect | undefined, TInclude extends CategoryInclude | undefined>(
    id: string,
    options?: CategoryOptions<TSelect, TInclude>,
  ): Promise<(Category & Prisma.CategoryInclude) | null>
  findOneByName<TSelect extends CategorySelect | undefined, TInclude extends CategoryInclude | undefined>(
    name: string,
    options?: CategoryOptions<TSelect, TInclude>,
  ): Promise<(Category & Prisma.CategoryInclude) | null>
  createOne<TSelect extends CategorySelect | undefined, TInclude extends CategoryInclude | undefined>(
    data: Prisma.CategoryCreateInput,
    options?: CategoryOptions<TSelect, TInclude>,
  ): Promise<(Category & Prisma.CategoryInclude) | null>
  updateOneById<TSelect extends CategorySelect | undefined, TInclude extends CategoryInclude | undefined>(
    id: string,
    data: Prisma.CategoryUpdateInput,
    options?: CategoryOptions<TSelect, TInclude>,
  ): Promise<(Category & Prisma.CategoryInclude) | null>
  deleteById(id: string): Promise<unknown>
}
