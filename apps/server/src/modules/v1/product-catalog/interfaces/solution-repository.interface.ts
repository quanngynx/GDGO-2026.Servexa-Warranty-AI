import { Prisma, type Solution } from "@/core/infra/prisma/generated/client";

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
  findAll(query: Prisma.SolutionFindManyArgs): Promise<(Solution & Prisma.SolutionInclude)[] | null>;
  count(where: Prisma.SolutionWhereInput): Promise<number>;
  findOneById<
    TSelect extends SolutionSelect | undefined,
    TInclude extends SolutionInclude | undefined,
  >(
    id: string,
    options?: SolutionOptions<TSelect, TInclude>,
  ): Promise<(Solution & Prisma.SolutionInclude) | null>;
  findOneByName<
    TSelect extends SolutionSelect | undefined,
    TInclude extends SolutionInclude | undefined,
  >(
    name: string,
    options?: SolutionOptions<TSelect, TInclude>,
  ): Promise<(Solution & Prisma.SolutionInclude) | null>;
  createOne<
    TSelect extends SolutionSelect | undefined,
    TInclude extends SolutionInclude | undefined,
  >(
    data: Prisma.SolutionCreateInput,
    options?: SolutionOptions<TSelect, TInclude>,
  ): Promise<(Solution & Prisma.SolutionInclude) | null>;
  updateOneById<
    TSelect extends SolutionSelect | undefined,
    TInclude extends SolutionInclude | undefined,
  >(
    id: string,
    data: Prisma.SolutionUpdateInput,
    options?: SolutionOptions<TSelect, TInclude>,
  ): Promise<(Solution & Prisma.SolutionInclude) | null>;
  deleteById(id: string): Promise<unknown>;
  createManyAndReturn(
    data: Prisma.SolutionCreateManyInput[],
  ): Promise<(Solution & Prisma.SolutionInclude)[] | null>;
}
