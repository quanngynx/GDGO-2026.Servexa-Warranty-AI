import type {
  CreateErrorPhenomenonDto,
  ReplaceErrorPhenomenonDto,
  UpdateErrorPhenomenonDto,
} from "../dtos/error-phenomenon.dto";
import type { FindAllErrorPhenomenaInput } from "../services/error-phenomenon.service";

export interface IErrorPhenomenonService {
  findAll(query: FindAllErrorPhenomenaInput): Promise<unknown>;
  findOneById(errorPhenomenonId: string): Promise<unknown>;
  create(input: CreateErrorPhenomenonDto): Promise<unknown>;
  update(
    errorPhenomenonId: string,
    input: ReplaceErrorPhenomenonDto | UpdateErrorPhenomenonDto,
  ): Promise<unknown>;
  delete(errorPhenomenonId: string): Promise<{ success: true }>;
}
