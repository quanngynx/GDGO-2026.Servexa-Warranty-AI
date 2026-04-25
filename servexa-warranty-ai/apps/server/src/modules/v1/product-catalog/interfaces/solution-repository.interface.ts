import type { Prisma } from "@servexa-warranty-ai/db/prisma/client";

type SolutionSelect = Prisma.SolutionSelect;
type SolutionInclude = Prisma.SolutionInclude;

export type SolutionOptions<
  TSelect extends SolutionSelect | undefined,
  TInclude extends SolutionInclude | undefined,
> = {
  select?: TSelect;
  include?: TInclude;
};

export interface ISolutionRepository {
  findAll(query: Prisma.SolutionFindManyArgs): Promise<unknown[]>;
  count(where: Prisma.SolutionWhereInput): Promise<number>;
  findOneById<
    TSelect extends SolutionSelect | undefined,
    TInclude extends SolutionInclude | undefined,
  >(
    id: string,
    options?: SolutionOptions<TSelect, TInclude>,
  ): Promise<unknown | null>;
  findOneByName<
    TSelect extends SolutionSelect | undefined,
    TInclude extends SolutionInclude | undefined,
  >(
    name: string,
    options?: SolutionOptions<TSelect, TInclude>,
  ): Promise<unknown | null>;
  createOne<
    TSelect extends SolutionSelect | undefined,
    TInclude extends SolutionInclude | undefined,
  >(
    data: Prisma.SolutionCreateInput,
    options?: SolutionOptions<TSelect, TInclude>,
  ): Promise<unknown>;
  updateOneById<
    TSelect extends SolutionSelect | undefined,
    TInclude extends SolutionInclude | undefined,
  >(
    id: string,
    data: Prisma.SolutionUpdateInput,
    options?: SolutionOptions<TSelect, TInclude>,
  ): Promise<unknown>;
  deleteById(id: string): Promise<unknown>;
  createManyAndReturn(
    data: Prisma.SolutionCreateManyInput[],
  ): Promise<unknown[]>;
}
