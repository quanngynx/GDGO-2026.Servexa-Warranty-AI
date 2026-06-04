import {
  type ErrorPhenomenon,
  Prisma,
} from "@/core/infra/prisma/generated/client";

type ErrorPhenomenonSelect = Prisma.ErrorPhenomenonSelect;
type ErrorPhenomenonInclude = Prisma.ErrorPhenomenonInclude;

export type ErrorPhenomenonOptions<
  TSelect extends ErrorPhenomenonSelect | undefined,
  TInclude extends ErrorPhenomenonInclude | undefined,
> = {
  select?: TSelect;
  include?: TInclude;
};

export interface IErrorPhenomenonRepository {
  findAll(
    query: Prisma.ErrorPhenomenonFindManyArgs,
  ): Promise<(ErrorPhenomenon & Prisma.ErrorPhenomenonInclude)[] | null>;
  count(where: Prisma.ErrorPhenomenonWhereInput): Promise<number>;
  findOneById<
    TSelect extends ErrorPhenomenonSelect | undefined,
    TInclude extends ErrorPhenomenonInclude | undefined,
  >(
    id: string,
    options?: ErrorPhenomenonOptions<TSelect, TInclude>,
  ): Promise<(ErrorPhenomenon & Prisma.ErrorPhenomenonInclude) | null>;
  findOneByNameAndCategory<
    TSelect extends ErrorPhenomenonSelect | undefined,
    TInclude extends ErrorPhenomenonInclude | undefined,
  >(
    categoryId: string | null | undefined,
    name: string,
    options?: ErrorPhenomenonOptions<TSelect, TInclude>,
  ): Promise<(ErrorPhenomenon & Prisma.ErrorPhenomenonInclude) | null>;
  createOne<
    TSelect extends ErrorPhenomenonSelect | undefined,
    TInclude extends ErrorPhenomenonInclude | undefined,
  >(
    data: Prisma.ErrorPhenomenonCreateInput,
    options?: ErrorPhenomenonOptions<TSelect, TInclude>,
  ): Promise<(ErrorPhenomenon & Prisma.ErrorPhenomenonInclude) | null>;
  updateOneById<
    TSelect extends ErrorPhenomenonSelect | undefined,
    TInclude extends ErrorPhenomenonInclude | undefined,
  >(
    id: string,
    data: Prisma.ErrorPhenomenonUpdateInput,
    options?: ErrorPhenomenonOptions<TSelect, TInclude>,
  ): Promise<(ErrorPhenomenon & Prisma.ErrorPhenomenonInclude) | null>;
  deleteById(id: string): Promise<unknown>;
  createManyAndReturn(
    data: Prisma.ErrorPhenomenonCreateManyInput[],
  ): Promise<(ErrorPhenomenon & Prisma.ErrorPhenomenonInclude)[] | null>;
}
