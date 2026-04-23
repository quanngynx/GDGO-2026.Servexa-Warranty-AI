import type { Prisma } from '@servexa-warranty-ai/db/prisma/client'

type ModelSelect = Prisma.ModelSelect
type ModelInclude = Prisma.ModelInclude

export type ModelOptions<
  TSelect extends ModelSelect | undefined,
  TInclude extends ModelInclude | undefined,
> = {
  select?: TSelect
  include?: TInclude
}

export type ModelExportRow = Prisma.ModelGetPayload<{
  select: {
    id: true
    modelCode: true
    name: true
    categoryId: true
    status: true
    laborCost: true
    inspectionCost: true
    stockNumber: true
    image: true
    createdAt: true
    updatedAt: true
  }
}>

export interface IModelRepository {
  findAll(query: Prisma.ModelFindManyArgs): Promise<unknown[]>
  count(where: Prisma.ModelWhereInput): Promise<number>
  findOneById<TSelect extends ModelSelect | undefined, TInclude extends ModelInclude | undefined>(
    id: string,
    options?: ModelOptions<TSelect, TInclude>,
  ): Promise<unknown | null>
  findOneByModelCode<TSelect extends ModelSelect | undefined, TInclude extends ModelInclude | undefined>(
    modelCode: string,
    options?: ModelOptions<TSelect, TInclude>,
  ): Promise<unknown | null>
  createOne<TSelect extends ModelSelect | undefined, TInclude extends ModelInclude | undefined>(
    data: Prisma.ModelCreateInput,
    options?: ModelOptions<TSelect, TInclude>,
  ): Promise<unknown>
  updateOneById<TSelect extends ModelSelect | undefined, TInclude extends ModelInclude | undefined>(
    id: string,
    data: Prisma.ModelUpdateInput,
    options?: ModelOptions<TSelect, TInclude>,
  ): Promise<unknown>
  softDeleteById(id: string): Promise<unknown>
  restoreById(id: string): Promise<unknown>
  findManyForExport(): Promise<ModelExportRow[]>
}
