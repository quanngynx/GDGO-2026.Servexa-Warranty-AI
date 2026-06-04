import { type Category, Prisma } from "@/core/infra/prisma/generated/client";
import type {
  CreateCategoryDto,
  ReplaceCategoryDto,
  UpdateCategoryDto,
} from "../dtos/category.dto";
import type { FindAllCategoriesInput } from "../services/category.service";
import type { BasePagination } from "@/types/pagination";

export interface ICategoryService {
  findAll(
    query: FindAllCategoriesInput,
  ): Promise<{
    items: (Category & Prisma.CategoryInclude)[] | null;
    pagination: BasePagination;
  }>;
  findOneById(
    categoryId: string,
  ): Promise<(Category & Prisma.CategoryInclude) | null>;
  create(
    input: CreateCategoryDto,
  ): Promise<(Category & Prisma.CategoryInclude) | null>;
  update(
    categoryId: string,
    input: ReplaceCategoryDto | UpdateCategoryDto,
  ): Promise<(Category & Prisma.CategoryInclude) | null>;
  delete(categoryId: string): Promise<{ success: true }>;
}
