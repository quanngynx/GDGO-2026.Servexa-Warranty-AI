import type { Prisma, TechnicianProfile } from "@servexa-warranty-ai/db/prisma/client";

type TechnicianSelect = Prisma.TechnicianProfileSelect;
type TechnicianInclude = Prisma.TechnicianProfileInclude;
type TechnicianOptions<
  TSelect extends TechnicianSelect | undefined,
  TInclude extends TechnicianInclude | undefined,
> = {
  select?: TSelect;
  include?: TInclude;
};

export interface ITechnicianRepository {
  findAll(query: Prisma.TechnicianProfileFindManyArgs): Promise<(TechnicianProfile & Prisma.TechnicianProfileInclude)[] | null | undefined>;
  count(where: Prisma.TechnicianProfileWhereInput): Promise<number>;
  findOneById<
    TSelect extends TechnicianSelect | undefined,
    TInclude extends TechnicianInclude | undefined,
  >(
    id: string,
    options?: TechnicianOptions<TSelect, TInclude>,
  ): Promise<TechnicianProfile & Prisma.TechnicianProfileInclude | null | undefined>;
  findOneByUserId<
    TSelect extends TechnicianSelect | undefined,
    TInclude extends TechnicianInclude | undefined,
  >(
    userId: string,
    options?: TechnicianOptions<TSelect, TInclude>,
  ): Promise<TechnicianProfile & Prisma.TechnicianProfileInclude | null | undefined>;
  createOne<
    TSelect extends TechnicianSelect | undefined,
    TInclude extends TechnicianInclude | undefined,
  >(
    data: Prisma.TechnicianProfileCreateInput,
    options?: TechnicianOptions<TSelect, TInclude>,
  ): Promise<unknown>;
  updateOneById<
    TSelect extends TechnicianSelect | undefined,
    TInclude extends TechnicianInclude | undefined,
  >(
    id: string,
    data: Prisma.TechnicianProfileUpdateInput,
    options?: TechnicianOptions<TSelect, TInclude>,
  ): Promise<unknown>;
  deleteById(id: string): Promise<unknown>;
}
