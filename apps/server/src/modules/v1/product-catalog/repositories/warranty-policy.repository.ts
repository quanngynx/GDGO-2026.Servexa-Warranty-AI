import prisma from "@servexa-warranty-ai/db";
import type {
  Prisma,
  WarrantyType,
} from "@servexa-warranty-ai/db/prisma/client";

import type {
  IWarrantyPolicyRepository,
  WarrantyPolicyOptions,
} from "../interfaces/warranty-policy-repository.interface";

type WarrantyPolicySelect = Prisma.WarrantyPolicySelect;
type WarrantyPolicyInclude = Prisma.WarrantyPolicyInclude;

export class WarrantyPolicyRepository implements IWarrantyPolicyRepository {
  async findAll(query: Prisma.WarrantyPolicyFindManyArgs) {
    const { take, skip, where, orderBy, ...rest } = query;
    return prisma.warrantyPolicy.findMany({
      take,
      skip,
      where,
      orderBy,
      ...rest,
    });
  }

  async count(where: Prisma.WarrantyPolicyWhereInput) {
    return prisma.warrantyPolicy.count({ where });
  }

  async findOneById<
    TSelect extends WarrantyPolicySelect | undefined,
    TInclude extends WarrantyPolicyInclude | undefined,
  >(id: string, options?: WarrantyPolicyOptions<TSelect, TInclude>) {
    return prisma.warrantyPolicy.findUnique({
      where: { id },
      ...options,
    });
  }

  async findOverlapping(
    target: { categoryId?: string | null; modelId?: string | null },
    warrantyType: WarrantyType,
    effectiveFrom: Date,
    effectiveTo?: Date | null,
    excludeId?: string,
  ) {
    const where: Prisma.WarrantyPolicyWhereInput = {
      warrantyType,
      status: "active",
      ...(target.categoryId
        ? { categoryId: target.categoryId, modelId: null }
        : { modelId: target.modelId, categoryId: null }),
      AND: [
        { effectiveFrom: { lte: effectiveTo ?? new Date("9999-12-31") } },
        {
          OR: [{ effectiveTo: null }, { effectiveTo: { gte: effectiveFrom } }],
        },
      ],
      ...(excludeId ? { id: { not: excludeId } } : {}),
    };

    return prisma.warrantyPolicy.findMany({ where });
  }

  async findActiveForResolve(
    target: { categoryId?: string; modelId?: string },
    warrantyType: WarrantyType,
    date: Date,
  ) {
    const where: Prisma.WarrantyPolicyWhereInput = {
      warrantyType,
      status: "active",
      ...(target.categoryId
        ? { categoryId: target.categoryId, modelId: null }
        : { modelId: target.modelId, categoryId: null }),
      effectiveFrom: { lte: date },
      OR: [{ effectiveTo: null }, { effectiveTo: { gte: date } }],
    };

    return prisma.warrantyPolicy.findFirst({
      where,
      orderBy: { effectiveFrom: "desc" },
    });
  }

  async createOne<
    TSelect extends WarrantyPolicySelect | undefined,
    TInclude extends WarrantyPolicyInclude | undefined,
  >(
    data: Prisma.WarrantyPolicyCreateInput,
    options?: WarrantyPolicyOptions<TSelect, TInclude>,
  ) {
    return prisma.warrantyPolicy.create({
      data,
      ...options,
    });
  }

  async updateOneById<
    TSelect extends WarrantyPolicySelect | undefined,
    TInclude extends WarrantyPolicyInclude | undefined,
  >(
    id: string,
    data: Prisma.WarrantyPolicyUpdateInput,
    options?: WarrantyPolicyOptions<TSelect, TInclude>,
  ) {
    return prisma.warrantyPolicy.update({
      where: { id },
      data,
      ...options,
    });
  }

  async deleteById(id: string) {
    return prisma.warrantyPolicy.delete({
      where: { id },
    });
  }
}
