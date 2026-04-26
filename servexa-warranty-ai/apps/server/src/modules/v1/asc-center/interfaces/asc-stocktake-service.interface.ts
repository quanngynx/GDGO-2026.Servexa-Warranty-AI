import type { BasePagination } from '@/types/pagination';
import type {
  FindAllAscStocktakesInput,
  FindStocktakeAccessoriesInput,
  FindStocktakeStockLevelsInput,
  CreateAscStocktakeInput,
} from '../dtos/asc-stocktake.dto';

export interface IAscStocktakeService {
  findHistoryByCenter(input: FindAllAscStocktakesInput): Promise<{ items: unknown[]; pagination: BasePagination }>;
  findOneById(id: string): Promise<unknown>;
  findAccessoriesForStocktake(input: FindStocktakeAccessoriesInput): Promise<{ items: unknown[]; pagination: BasePagination }>;
  findStockLevels(input: FindStocktakeStockLevelsInput): Promise<{ items: unknown[]; pagination: BasePagination }>;
  create(input: CreateAscStocktakeInput, userId: string): Promise<unknown>;
}
