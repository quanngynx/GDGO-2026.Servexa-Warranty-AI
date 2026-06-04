import prisma from "@/core/infra/prisma";
import { Prisma } from "@/core/infra/prisma/generated/client";

import type {
  ErrorPhenomenonOptions,
  IErrorPhenomenonRepository,
} from "../interfaces/error-phenomenon-repository.interface";

type ErrorPhenomenonSelect = Prisma.ErrorPhenomenonSelect;
type ErrorPhenomenonInclude = Prisma.ErrorPhenomenonInclude;

export class ErrorPhenomenonRepository implements IErrorPhenomenonRepository {
  async findAll(query: Prisma.ErrorPhenomenonFindManyArgs) {
    const { take, skip, where, orderBy, ...rest } = query;
    return prisma.errorPhenomenon.findMany({
      take,
      skip,
      where,
      orderBy,
      ...rest,
    });
  }

  async count(where: Prisma.ErrorPhenomenonWhereInput) {
    return prisma.errorPhenomenon.count({ where });
  }

  async findOneById<
    TSelect extends ErrorPhenomenonSelect | undefined,
    TInclude extends ErrorPhenomenonInclude | undefined,
  >(id: string, options?: ErrorPhenomenonOptions<TSelect, TInclude>) {
    return prisma.errorPhenomenon.findUnique({
      where: { id },
      ...options,
    });
  }

  async findOneByNameAndCategory<
    TSelect extends ErrorPhenomenonSelect | undefined,
    TInclude extends ErrorPhenomenonInclude | undefined,
  >(
    categoryId: string | null | undefined,
    name: string,
    options?: ErrorPhenomenonOptions<TSelect, TInclude>,
  ) {
    return prisma.errorPhenomenon.findFirst({
      where: {
        categoryId: categoryId || null,
        name: { equals: name, mode: "insensitive" },
      },
      ...options,
    });
  }

  async createOne<
    TSelect extends ErrorPhenomenonSelect | undefined,
    TInclude extends ErrorPhenomenonInclude | undefined,
  >(
    data: Prisma.ErrorPhenomenonCreateInput,
    options?: ErrorPhenomenonOptions<TSelect, TInclude>,
  ) {
    return prisma.errorPhenomenon.create({
      data,
      ...options,
    });
  }

  async updateOneById<
    TSelect extends ErrorPhenomenonSelect | undefined,
    TInclude extends ErrorPhenomenonInclude | undefined,
  >(
    id: string,
    data: Prisma.ErrorPhenomenonUpdateInput,
    options?: ErrorPhenomenonOptions<TSelect, TInclude>,
  ) {
    return prisma.errorPhenomenon.update({
      where: { id },
      data,
      ...options,
    });
  }

  async deleteById(id: string) {
    return prisma.errorPhenomenon.delete({
      where: { id },
    });
  }

  async createManyAndReturn(data: Prisma.ErrorPhenomenonCreateManyInput[]) {
    return prisma.errorPhenomenon.createManyAndReturn({
      data,
      skipDuplicates: true,
    });
  }
}
