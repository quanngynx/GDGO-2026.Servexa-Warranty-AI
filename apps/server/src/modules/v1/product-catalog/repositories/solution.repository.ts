import prisma from "@/core/infra/prisma";
import { Prisma } from "@/core/infra/prisma/generated/client";

import type {
  SolutionOptions,
  ISolutionRepository,
} from "../interfaces/solution-repository.interface";

type SolutionSelect = Prisma.SolutionSelect;
type SolutionInclude = Prisma.SolutionInclude;

export class SolutionRepository implements ISolutionRepository {
  async findAll(query: Prisma.SolutionFindManyArgs) {
    const { take, skip, where, orderBy, ...rest } = query;
    return prisma.solution.findMany({
      take,
      skip,
      where,
      orderBy,
      ...rest,
    });
  }

  async count(where: Prisma.SolutionWhereInput) {
    return prisma.solution.count({ where });
  }

  async findOneById<
    TSelect extends SolutionSelect | undefined,
    TInclude extends SolutionInclude | undefined,
  >(id: string, options?: SolutionOptions<TSelect, TInclude>) {
    return prisma.solution.findUnique({
      where: { id },
      ...options,
    });
  }

  async findOneByName<
    TSelect extends SolutionSelect | undefined,
    TInclude extends SolutionInclude | undefined,
  >(name: string, options?: SolutionOptions<TSelect, TInclude>) {
    return prisma.solution.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
      ...options,
    });
  }

  async createOne<
    TSelect extends SolutionSelect | undefined,
    TInclude extends SolutionInclude | undefined,
  >(
    data: Prisma.SolutionCreateInput,
    options?: SolutionOptions<TSelect, TInclude>,
  ) {
    return prisma.solution.create({
      data,
      ...options,
    });
  }

  async updateOneById<
    TSelect extends SolutionSelect | undefined,
    TInclude extends SolutionInclude | undefined,
  >(
    id: string,
    data: Prisma.SolutionUpdateInput,
    options?: SolutionOptions<TSelect, TInclude>,
  ) {
    return prisma.solution.update({
      where: { id },
      data,
      ...options,
    });
  }

  async deleteById(id: string) {
    return prisma.solution.delete({
      where: { id },
    });
  }

  async createManyAndReturn(data: Prisma.SolutionCreateManyInput[]) {
    return prisma.solution.createManyAndReturn({
      data,
      skipDuplicates: true,
    });
  }
}
