import type { Prisma } from '@servexa-warranty-ai/db/prisma/client'

import type { CreateAscCenterDto, ReplaceAscCenterDto, UpdateAscCenterDto } from '../dtos/asc-center.dto'
import type { FindAllAscCentersInput } from '../services/asc-center.service'

type AscCenterSelect = Prisma.AscCenterSelect
type AscCenterInclude = Prisma.AscCenterInclude

export type AscCenterOptions<
  TSelect extends AscCenterSelect | undefined,
  TInclude extends AscCenterInclude | undefined,
> = {
  select?: TSelect
  include?: TInclude
}

export interface IAscCenterRepository {
  findAll(query: Prisma.AscCenterFindManyArgs): Promise<unknown[]>
  count(where: Prisma.AscCenterWhereInput): Promise<number>
  findOneById<TSelect extends AscCenterSelect | undefined, TInclude extends AscCenterInclude | undefined>(
    id: string,
    options?: AscCenterOptions<TSelect, TInclude>,
  ): Promise<unknown | null>
  findOneByCenterCode<TSelect extends AscCenterSelect | undefined, TInclude extends AscCenterInclude | undefined>(
    centerCode: string,
    options?: AscCenterOptions<TSelect, TInclude>,
  ): Promise<unknown | null>
  createOne<TSelect extends AscCenterSelect | undefined, TInclude extends AscCenterInclude | undefined>(
    data: Prisma.AscCenterCreateInput,
    options?: AscCenterOptions<TSelect, TInclude>,
  ): Promise<unknown>
  updateOneById<TSelect extends AscCenterSelect | undefined, TInclude extends AscCenterInclude | undefined>(
    id: string,
    data: Prisma.AscCenterUpdateInput,
    options?: AscCenterOptions<TSelect, TInclude>,
  ): Promise<unknown>
  deleteById(id: string): Promise<unknown>
}

export interface IAscCenterService {
  findAll(query: FindAllAscCentersInput): Promise<unknown>
  findOneById(ascCenterId: string): Promise<unknown>
  create(input: CreateAscCenterDto): Promise<unknown>
  update(ascCenterId: string, input: ReplaceAscCenterDto | UpdateAscCenterDto): Promise<unknown>
  delete(ascCenterId: string): Promise<{ success: true }>
}
