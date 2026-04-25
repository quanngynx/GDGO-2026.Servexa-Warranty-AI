import { Prisma } from "@servexa-warranty-ai/db/prisma/client";

import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { createOperationalError } from "@/middlewares/error-middleware";
import { buildPagination } from "@/utils/pagination";

import type {
  CreateSolutionDto,
  ReplaceSolutionDto,
  UpdateSolutionDto,
} from "../dtos/solution.dto";
import type { ISolutionRepository } from "../interfaces/solution-repository.interface";
import type { ISolutionService } from "../interfaces/solution-service.interface";
import { SolutionRepository } from "../repositories/solution.repository";

const solutionSelect = {
  id: true,
  name: true,
  description: true,
  instructions: true,
  estimatedTime: true,
  difficulty: true,
  requiredTools: true,
  requiredParts: true,
  status: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SolutionSelect;

export type FindAllSolutionsInput = {
  page: number;
  limit: number;
  search: string;
  sortBy: "createdAt" | "updatedAt" | "name";
  sortOrder: "asc" | "desc";
  status?: "active" | "inactive";
  difficulty?: "easy" | "medium" | "hard";
};

export class SolutionService implements ISolutionService {
  constructor(
    private readonly solutionRepository: ISolutionRepository = new SolutionRepository(),
  ) {}

  async findAll(query: FindAllSolutionsInput) {
    const where: Prisma.SolutionWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.difficulty ? { difficulty: query.difficulty } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
              { instructions: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.solutionRepository.findAll({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
        select: solutionSelect,
      }),
      this.solutionRepository.count(where),
    ]);

    return {
      items,
      pagination: buildPagination(query.page, query.limit, total),
    };
  }

  async findOneById(solutionId: string) {
    const found = await this.solutionRepository.findOneById(solutionId, {
      select: solutionSelect,
    });

    if (!found) {
      throw createOperationalError(
        "Solution not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }

    return found;
  }

  private buildCreateData(
    input: CreateSolutionDto & { createdBy: string },
  ): Prisma.SolutionCreateInput {
    return {
      name: input.name,
      description: input.description,
      instructions: input.instructions,
      estimatedTime: input.estimatedTime,
      difficulty: input.difficulty,
      requiredTools: input.requiredTools,
      requiredParts: input.requiredParts,
      status: input.status,
      creator: { connect: { id: input.createdBy } },
    };
  }

  private buildUpdateInput(
    input: ReplaceSolutionDto | UpdateSolutionDto,
  ): Prisma.SolutionUpdateInput {
    const data: Prisma.SolutionUpdateInput = {};

    if (input.name !== undefined) data.name = input.name;
    if (input.description !== undefined) data.description = input.description;
    if (input.instructions !== undefined)
      data.instructions = input.instructions;
    if (input.estimatedTime !== undefined)
      data.estimatedTime = input.estimatedTime;
    if (input.difficulty !== undefined) data.difficulty = input.difficulty;
    if (input.requiredTools !== undefined)
      data.requiredTools = input.requiredTools;
    if (input.requiredParts !== undefined)
      data.requiredParts = input.requiredParts;
    if (input.status !== undefined) data.status = input.status;

    return data;
  }

  async create(input: CreateSolutionDto & { createdBy: string }) {
    return this.solutionRepository.createOne(this.buildCreateData(input), {
      select: solutionSelect,
    });
  }

  async update(
    solutionId: string,
    input: ReplaceSolutionDto | UpdateSolutionDto,
  ) {
    const existing = await this.solutionRepository.findOneById(solutionId, {
      select: { id: true },
    });

    if (!existing) {
      throw createOperationalError(
        "Solution not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }

    const data = this.buildUpdateInput(input);

    if (Object.keys(data).length === 0) {
      throw createOperationalError(
        "No fields to update",
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
    }

    return this.solutionRepository.updateOneById(solutionId, data, {
      select: solutionSelect,
    });
  }

  async delete(solutionId: string) {
    const existing = await this.solutionRepository.findOneById(solutionId, {
      select: { id: true },
    });

    if (!existing) {
      throw createOperationalError(
        "Solution not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }

    await this.solutionRepository.deleteById(solutionId);

    return { success: true as const };
  }
}
