import type {
  Prisma,
  WarrantyPolicy,
  WarrantyType,
} from "@servexa-warranty-ai/db/prisma/client";

type WarrantyPolicySelect = Prisma.WarrantyPolicySelect;
type WarrantyPolicyInclude = Prisma.WarrantyPolicyInclude;

export type WarrantyPolicyOptions<
  TSelect extends WarrantyPolicySelect | undefined,
  TInclude extends WarrantyPolicyInclude | undefined,
> = {
  select?: TSelect;
  include?: TInclude;
};

export interface IWarrantyPolicyRepository {
  findAll(query: Prisma.WarrantyPolicyFindManyArgs): Promise<(WarrantyPolicy & Prisma.WarrantyPolicyInclude)[] | null>;
  count(where: Prisma.WarrantyPolicyWhereInput): Promise<number>;
  findOneById<
    TSelect extends WarrantyPolicySelect | undefined,
    TInclude extends WarrantyPolicyInclude | undefined,
  >(
    id: string,
    options?: WarrantyPolicyOptions<TSelect, TInclude>,
  ): Promise<(WarrantyPolicy & Prisma.WarrantyPolicyInclude) | null>;
  findOverlapping(
    target: { categoryId?: string | null; modelId?: string | null },
    warrantyType: WarrantyType,
    effectiveFrom: Date,
    effectiveTo?: Date | null,
    excludeId?: string,
  ): Promise<(WarrantyPolicy & Prisma.WarrantyPolicyInclude)[] | null>;
  findActiveForResolve(
    target: { categoryId?: string; modelId?: string },
    warrantyType: WarrantyType,
    date: Date,
  ): Promise<(WarrantyPolicy & Prisma.WarrantyPolicyInclude) | null>;
  createOne<
    TSelect extends WarrantyPolicySelect | undefined,
    TInclude extends WarrantyPolicyInclude | undefined,
  >(
    data: Prisma.WarrantyPolicyCreateInput,
    options?: WarrantyPolicyOptions<TSelect, TInclude>,
  ): Promise<(WarrantyPolicy & Prisma.WarrantyPolicyInclude) | null>;
  updateOneById<
    TSelect extends WarrantyPolicySelect | undefined,
    TInclude extends WarrantyPolicyInclude | undefined,
  >(
    id: string,
    data: Prisma.WarrantyPolicyUpdateInput,
    options?: WarrantyPolicyOptions<TSelect, TInclude>,
  ): Promise<(WarrantyPolicy & Prisma.WarrantyPolicyInclude) | null>;
  deleteById(id: string): Promise<unknown>;
}
