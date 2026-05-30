import type { Solution, Prisma } from "@servexa-warranty-ai/db/prisma/client";
import type {
  CreateSolutionDto,
  ReplaceSolutionDto,
  UpdateSolutionDto,
} from "../dtos/solution.dto";
import type { FindAllSolutionsInput } from "../services/solution.service";
import type { BasePagination } from "src/types/pagination";

export interface ISolutionService {
  findAll(query: FindAllSolutionsInput): Promise<{ items: (Solution & Prisma.SolutionInclude)[] | null, pagination: BasePagination }>;
  findOneById(solutionId: string): Promise<(Solution & Prisma.SolutionInclude) | null>;
  create(input: CreateSolutionDto & { createdBy: string }): Promise<(Solution & Prisma.SolutionInclude) | null>;
  update(
    solutionId: string,
    input: ReplaceSolutionDto | UpdateSolutionDto,
  ): Promise<(Solution & Prisma.SolutionInclude) | null>;
  delete(solutionId: string): Promise<{ success: true }>;
}
