import { Prisma } from "@/core/infra/prisma/generated/client";

import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { createOperationalError } from "@/middlewares/error-middleware";
import { buildPagination } from "@/utils/pagination";

import type {
  CreateErrorPhenomenonDto,
  ReplaceErrorPhenomenonDto,
  UpdateErrorPhenomenonDto,
} from "../dtos/error-phenomenon.dto";
import type { IErrorPhenomenonRepository } from "../interfaces/error-phenomenon-repository.interface";
import type { IErrorPhenomenonService } from "../interfaces/error-phenomenon-service.interface";
import { ErrorPhenomenonRepository } from "../repositories/error-phenomenon.repository";

const errorPhenomenonSelect = {
  id: true,
  categoryId: true,
  name: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.ErrorPhenomenonSelect;

export type FindAllErrorPhenomenaInput = {
  page: number;
  limit: number;
  search: string;
  sortBy: "createdAt" | "updatedAt" | "name";
  sortOrder: "asc" | "desc";
  status?: "active" | "inactive";
  categoryId?: string;
};

export class ErrorPhenomenonService implements IErrorPhenomenonService {
  constructor(
    private readonly errorPhenomenonRepository: IErrorPhenomenonRepository = new ErrorPhenomenonRepository(),
  ) {}

  async findAll(query: FindAllErrorPhenomenaInput) {
    const where: Prisma.ErrorPhenomenonWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.errorPhenomenonRepository.findAll({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
        select: errorPhenomenonSelect,
      }),
      this.errorPhenomenonRepository.count(where),
    ]);

    return {
      items,
      pagination: buildPagination(query.page, query.limit, total),
    };
  }

  async findOneById(errorPhenomenonId: string) {
    const found = await this.errorPhenomenonRepository.findOneById(
      errorPhenomenonId,
      {
        select: errorPhenomenonSelect,
      },
    );

    if (!found) {
      throw createOperationalError(
        "Error phenomenon not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }

    return found;
  }

  private buildCreateData(
    input: CreateErrorPhenomenonDto | ReplaceErrorPhenomenonDto,
  ): Prisma.ErrorPhenomenonCreateInput {
    return {
      name: input.name,
      description: input.description,
      status: input.status,
      ...(input.categoryId
        ? { category: { connect: { id: input.categoryId } } }
        : {}),
    };
  }

  private buildUpdateInput(
    input: ReplaceErrorPhenomenonDto | UpdateErrorPhenomenonDto,
  ): Prisma.ErrorPhenomenonUpdateInput {
    const data: Prisma.ErrorPhenomenonUpdateInput = {};

    if (input.name !== undefined) data.name = input.name;
    if (input.description !== undefined) data.description = input.description;
    if (input.status !== undefined) data.status = input.status;
    if (input.categoryId !== undefined) {
      if (input.categoryId === null) {
        data.category = { disconnect: true };
      } else {
        data.category = { connect: { id: input.categoryId } };
      }
    }

    return data;
  }

  async create(input: CreateErrorPhenomenonDto) {
    const duplicate =
      await this.errorPhenomenonRepository.findOneByNameAndCategory(
        input.categoryId,
        input.name,
        {
          select: { id: true },
        },
      );

    if (duplicate) {
      throw createOperationalError(
        "Error phenomenon with this name already exists in this category",
        HTTP_RESPONSE_CODE.CONFLICT,
      );
    }

    return this.errorPhenomenonRepository.createOne(
      this.buildCreateData(input),
      { select: errorPhenomenonSelect },
    );
  }

  async update(
    errorPhenomenonId: string,
    input: ReplaceErrorPhenomenonDto | UpdateErrorPhenomenonDto,
  ) {
    const existing = (await this.errorPhenomenonRepository.findOneById(
      errorPhenomenonId,
      {
        select: { id: true, name: true, categoryId: true },
      },
    )) as { id: string; name: string; categoryId: string | null } | null;

    if (!existing) {
      throw createOperationalError(
        "Error phenomenon not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }

    const newName = input.name ?? existing.name;
    const newCategoryId =
      input.categoryId !== undefined ? input.categoryId : existing.categoryId;

    if (newName !== existing.name || newCategoryId !== existing.categoryId) {
      const duplicate =
        (await this.errorPhenomenonRepository.findOneByNameAndCategory(
          newCategoryId,
          newName,
          {
            select: { id: true },
          },
        )) as { id: string } | null;

      if (duplicate && duplicate.id !== errorPhenomenonId) {
        throw createOperationalError(
          "Error phenomenon with this name already exists in this category",
          HTTP_RESPONSE_CODE.CONFLICT,
        );
      }
    }

    const data = this.buildUpdateInput(input);

    if (Object.keys(data).length === 0) {
      throw createOperationalError(
        "No fields to update",
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
    }

    return this.errorPhenomenonRepository.updateOneById(
      errorPhenomenonId,
      data,
      { select: errorPhenomenonSelect },
    );
  }

  async delete(errorPhenomenonId: string) {
    const existing = await this.errorPhenomenonRepository.findOneById(
      errorPhenomenonId,
      {
        select: { id: true },
      },
    );

    if (!existing) {
      throw createOperationalError(
        "Error phenomenon not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }

    await this.errorPhenomenonRepository.deleteById(errorPhenomenonId);

    return { success: true as const };
  }
}
