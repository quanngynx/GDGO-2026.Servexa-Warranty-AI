import { type Model, Prisma } from '@/core/infra/prisma/generated/client'

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
  findAll(query: Prisma.ModelFindManyArgs): Promise<(Model & Prisma.ModelInclude)[] | null>
  count(where: Prisma.ModelWhereInput): Promise<number>
  findOneById<TSelect extends ModelSelect | undefined, TInclude extends ModelInclude | undefined>(
    id: string,
    options?: ModelOptions<TSelect, TInclude>,
  ): Promise<(Model & Prisma.ModelInclude) | null>
  findOneByModelCode<TSelect extends ModelSelect | undefined, TInclude extends ModelInclude | undefined>(
    modelCode: string,
    options?: ModelOptions<TSelect, TInclude>,
  ): Promise<(Model & Prisma.ModelInclude) | null>
  createOne<TSelect extends ModelSelect | undefined, TInclude extends ModelInclude | undefined>(
    data: Prisma.ModelCreateInput,
    options?: ModelOptions<TSelect, TInclude>,
  ): Promise<(Model & Prisma.ModelInclude) | null>
  updateOneById<TSelect extends ModelSelect | undefined, TInclude extends ModelInclude | undefined>(
    id: string,
    data: Prisma.ModelUpdateInput,
    options?: ModelOptions<TSelect, TInclude>,
  ): Promise<(Model & Prisma.ModelInclude) | null>
  softDeleteById(id: string): Promise<unknown>
  restoreById(id: string): Promise<unknown>
  findManyForExport(): Promise<ModelExportRow[]>
}
