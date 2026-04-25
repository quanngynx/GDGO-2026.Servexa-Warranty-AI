import type {
  CreateSolutionDto,
  ReplaceSolutionDto,
  UpdateSolutionDto,
} from "../dtos/solution.dto";
import type { FindAllSolutionsInput } from "../services/solution.service";

export interface ISolutionService {
  findAll(query: FindAllSolutionsInput): Promise<unknown>;
  findOneById(solutionId: string): Promise<unknown>;
  create(input: CreateSolutionDto & { createdBy: string }): Promise<unknown>;
  update(
    solutionId: string,
    input: ReplaceSolutionDto | UpdateSolutionDto,
  ): Promise<unknown>;
  delete(solutionId: string): Promise<{ success: true }>;
}
