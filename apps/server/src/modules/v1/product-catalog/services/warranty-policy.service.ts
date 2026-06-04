import { Prisma } from "@/core/infra/prisma/generated/client";
import prisma from "@/core/infra/prisma";

import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { createOperationalError } from "@/middlewares/error-middleware";
import { buildPagination } from "@/utils/pagination";

import type {
  CreateWarrantyPolicyDto,
  ReplaceWarrantyPolicyDto,
  ResolveWarrantyPolicyDto,
  UpdateWarrantyPolicyDto,
} from "../dtos/warranty-policy.dto";
import type { ICategoryRepository } from "../interfaces/category-repository.interface";
import type { IModelRepository } from "../interfaces/model-repository.interface";
import type { IWarrantyPolicyRepository } from "../interfaces/warranty-policy-repository.interface";
import type { IWarrantyPolicyService } from "../interfaces/warranty-policy-service.interface";
import { CategoryRepository } from "../repositories/category.repository";
import { ModelRepository } from "../repositories/model.repository";
import { WarrantyPolicyRepository } from "../repositories/warranty-policy.repository";
import type { findAllWarrantyPoliciesSchema } from "../validations";
import type { z } from "zod";

type FindAllWarrantyPoliciesInput = z.infer<
  typeof findAllWarrantyPoliciesSchema
>;

const warrantyPolicyListSelect = {
  id: true,
  categoryId: true,
  modelId: true,
  warrantyType: true,
  warrantyDurationMonths: true,
  effectiveFrom: true,
  effectiveTo: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.WarrantyPolicySelect;

const warrantyPolicyDetailSelect = {
  ...warrantyPolicyListSelect,
  coverageDescription: true,
  termsConditions: true,
  category: { select: { id: true, name: true } },
  model: { select: { id: true, name: true, modelCode: true } },
} satisfies Prisma.WarrantyPolicySelect;

export class WarrantyPolicyService implements IWarrantyPolicyService {
  constructor(
    private readonly warrantyPolicyRepository: IWarrantyPolicyRepository = new WarrantyPolicyRepository(),
    private readonly categoryRepository: ICategoryRepository = new CategoryRepository(),
    private readonly modelRepository: IModelRepository = new ModelRepository(),
  ) {}

  async findAll(query: FindAllWarrantyPoliciesInput) {
    const where: Prisma.WarrantyPolicyWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.warrantyType ? { warrantyType: query.warrantyType } : {}),
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.modelId ? { modelId: query.modelId } : {}),
      ...(query.target === "category" ? { categoryId: { not: null } } : {}),
      ...(query.target === "model" ? { modelId: { not: null } } : {}),
      ...(query.search
        ? {
            OR: [
              {
                coverageDescription: {
                  contains: query.search,
                  mode: "insensitive",
                },
              },
              {
                termsConditions: {
                  contains: query.search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
      ...(query.effectiveOn
        ? {
            AND: [
              { effectiveFrom: { lte: query.effectiveOn } },
              {
                OR: [
                  { effectiveTo: null },
                  { effectiveTo: { gte: query.effectiveOn } },
                ],
              },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.warrantyPolicyRepository.findAll({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
        select: warrantyPolicyListSelect,
      }),
      this.warrantyPolicyRepository.count(where),
    ]);

    return {
      items,
      pagination: buildPagination(query.page, query.limit, total),
    };
  }

  async findOneById(warrantyPolicyId: string) {
    const found = await this.warrantyPolicyRepository.findOneById(
      warrantyPolicyId,
      {
        select: warrantyPolicyDetailSelect,
      },
    );

    if (!found) {
      throw createOperationalError(
        "Warranty policy not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }

    return found;
  }

  async create(input: CreateWarrantyPolicyDto) {
    // Validate target existence
    if (input.categoryId) {
      const category = await this.categoryRepository.findOneById(
        input.categoryId,
        { select: { id: true } },
      );
      if (!category)
        throw createOperationalError(
          "Category not found",
          HTTP_RESPONSE_CODE.BAD_REQUEST,
        );
    } else if (input.modelId) {
      const model = await this.modelRepository.findOneById(input.modelId, {
        select: { id: true },
      });
      if (!model)
        throw createOperationalError(
          "Model not found",
          HTTP_RESPONSE_CODE.BAD_REQUEST,
        );
    }

    // Overlap check
    if (input.status === "active") {
      const overlapping = await this.warrantyPolicyRepository.findOverlapping(
        { categoryId: input.categoryId, modelId: input.modelId },
        input.warrantyType,
        input.effectiveFrom,
        input.effectiveTo,
      );
      if (overlapping && overlapping.length > 0) {
        throw createOperationalError(
          "Overlapping active warranty policy exists",
          HTTP_RESPONSE_CODE.CONFLICT,
        );
      }
    }

    return this.warrantyPolicyRepository.createOne(
      {
        warrantyType: input.warrantyType,
        warrantyDurationMonths: input.warrantyDurationMonths,
        coverageDescription: input.coverageDescription,
        termsConditions: input.termsConditions,
        effectiveFrom: input.effectiveFrom,
        effectiveTo: input.effectiveTo,
        status: input.status,
        ...(input.categoryId
          ? { category: { connect: { id: input.categoryId } } }
          : {}),
        ...(input.modelId ? { model: { connect: { id: input.modelId } } } : {}),
      },
      { select: warrantyPolicyDetailSelect },
    );
  }

  async update(
    warrantyPolicyId: string,
    input: ReplaceWarrantyPolicyDto | UpdateWarrantyPolicyDto,
  ) {
    const existing = (await this.warrantyPolicyRepository.findOneById(
      warrantyPolicyId,
    )) as any;

    if (!existing) {
      throw createOperationalError(
        "Warranty policy not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }

    const merged = { ...existing, ...input };

    if (
      (merged.categoryId && merged.modelId) ||
      (!merged.categoryId && !merged.modelId)
    ) {
      throw createOperationalError(
        "Exactly one of categoryId or modelId must be non-null",
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
    }

    // Check target existence if changed
    if (
      input.categoryId !== undefined &&
      input.categoryId !== existing.categoryId &&
      input.categoryId
    ) {
      const category = await this.categoryRepository.findOneById(
        input.categoryId,
        { select: { id: true } },
      );
      if (!category)
        throw createOperationalError(
          "Category not found",
          HTTP_RESPONSE_CODE.BAD_REQUEST,
        );
    } else if (
      input.modelId !== undefined &&
      input.modelId !== existing.modelId &&
      input.modelId
    ) {
      const model = await this.modelRepository.findOneById(input.modelId, {
        select: { id: true },
      });
      if (!model)
        throw createOperationalError(
          "Model not found",
          HTTP_RESPONSE_CODE.BAD_REQUEST,
        );
    }

    const checkOverlap =
      merged.status === "active" &&
      (input.categoryId !== undefined ||
        input.modelId !== undefined ||
        input.warrantyType !== undefined ||
        input.effectiveFrom !== undefined ||
        input.effectiveTo !== undefined ||
        input.status !== undefined);

    if (checkOverlap) {
      const overlapping = await this.warrantyPolicyRepository.findOverlapping(
        { categoryId: merged.categoryId, modelId: merged.modelId },
        merged.warrantyType,
        merged.effectiveFrom,
        merged.effectiveTo,
        warrantyPolicyId,
      );
      if (overlapping && overlapping.length > 0) {
        throw createOperationalError(
          "Overlapping active warranty policy exists",
          HTTP_RESPONSE_CODE.CONFLICT,
        );
      }
    }

    const data: Prisma.WarrantyPolicyUpdateInput = {};

    if (input.categoryId !== undefined) {
      data.category = input.categoryId
        ? { connect: { id: input.categoryId } }
        : { disconnect: true };
    }
    if (input.modelId !== undefined) {
      data.model = input.modelId
        ? { connect: { id: input.modelId } }
        : { disconnect: true };
    }
    if (input.warrantyType !== undefined)
      data.warrantyType = input.warrantyType;
    if (input.warrantyDurationMonths !== undefined)
      data.warrantyDurationMonths = input.warrantyDurationMonths;
    if (input.coverageDescription !== undefined)
      data.coverageDescription = input.coverageDescription;
    if (input.termsConditions !== undefined)
      data.termsConditions = input.termsConditions;
    if (input.effectiveFrom !== undefined)
      data.effectiveFrom = input.effectiveFrom;
    if (input.effectiveTo !== undefined) data.effectiveTo = input.effectiveTo;
    if (input.status !== undefined) data.status = input.status;

    if (Object.keys(data).length === 0) {
      throw createOperationalError(
        "No fields to update",
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
    }

    return this.warrantyPolicyRepository.updateOneById(warrantyPolicyId, data, {
      select: warrantyPolicyDetailSelect,
    });
  }

  async delete(warrantyPolicyId: string) {
    const existing = await this.warrantyPolicyRepository.findOneById(
      warrantyPolicyId,
      { select: { id: true } },
    );

    if (!existing) {
      throw createOperationalError(
        "Warranty policy not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }

    const count = await prisma.productWarranty.count({
      where: { warrantyPolicyId },
    });
    if (count > 0) {
      throw createOperationalError(
        "Cannot delete warranty policy that is associated with product warranties",
        HTTP_RESPONSE_CODE.CONFLICT,
      );
    }

    await this.warrantyPolicyRepository.deleteById(warrantyPolicyId);

    return { success: true as const };
  }

  async resolve(input: ResolveWarrantyPolicyDto) {
    const target = {
      categoryId: input.categoryId,
      modelId: input.modelId,
    };
    const date = input.date || new Date();

    const resolved = await this.warrantyPolicyRepository.findActiveForResolve(
      target,
      input.warrantyType,
      date,
    );

    if (!resolved) {
      throw createOperationalError(
        "No matching active warranty policy found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }

    return resolved;
  }
}
