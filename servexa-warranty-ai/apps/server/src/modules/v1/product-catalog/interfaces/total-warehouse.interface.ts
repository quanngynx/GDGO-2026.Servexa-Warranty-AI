import type { Prisma } from '@servexa-warranty-ai/db/prisma/client'

import type { CreateTotalWarehouseDto, ReplaceTotalWarehouseDto, UpdateTotalWarehouseDto } from '../dtos/total-warehouse.dto'
import type { FindAllTotalWarehousesInput } from '../services/total-warehouse.service'

type TotalWarehouseSelect = Prisma.TotalWarehouseSelect
type TotalWarehouseInclude = Prisma.TotalWarehouseInclude

export type TotalWarehouseOptions<
  TSelect extends TotalWarehouseSelect | undefined,
  TInclude extends TotalWarehouseInclude | undefined,
> = {
  select?: TSelect
  include?: TInclude
}

export interface ITotalWarehouseRepository {
  findAll(query: Prisma.TotalWarehouseFindManyArgs): Promise<unknown[]>
  count(where: Prisma.TotalWarehouseWhereInput): Promise<number>
  findOneById<TSelect extends TotalWarehouseSelect | undefined, TInclude extends TotalWarehouseInclude | undefined>(
    id: string,
    options?: TotalWarehouseOptions<TSelect, TInclude>,
  ): Promise<unknown | null>
  findOneByName<TSelect extends TotalWarehouseSelect | undefined, TInclude extends TotalWarehouseInclude | undefined>(
    name: string,
    options?: TotalWarehouseOptions<TSelect, TInclude>,
  ): Promise<unknown | null>
  createOne<TSelect extends TotalWarehouseSelect | undefined, TInclude extends TotalWarehouseInclude | undefined>(
    data: Prisma.TotalWarehouseCreateInput,
    options?: TotalWarehouseOptions<TSelect, TInclude>,
  ): Promise<unknown>
  updateOneById<TSelect extends TotalWarehouseSelect | undefined, TInclude extends TotalWarehouseInclude | undefined>(
    id: string,
    data: Prisma.TotalWarehouseUpdateInput,
    options?: TotalWarehouseOptions<TSelect, TInclude>,
  ): Promise<unknown>
  deleteById(id: string): Promise<unknown>
}

export interface ITotalWarehouseService {
  findAll(query: FindAllTotalWarehousesInput): Promise<unknown>
  findOneById(totalWarehouseId: string): Promise<unknown>
  create(input: CreateTotalWarehouseDto, createdBy: string): Promise<unknown>
  update(totalWarehouseId: string, input: ReplaceTotalWarehouseDto | UpdateTotalWarehouseDto, updatedBy: string): Promise<unknown>
  delete(totalWarehouseId: string): Promise<{ success: true }>
}
