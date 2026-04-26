import type {
  FindAllAscStocktakesInput,
  FindStocktakeAccessoriesInput,
  FindStocktakeStockLevelsInput,
} from '../dtos/asc-stocktake.dto';

export interface IAscStocktakeRepository {
  findManyHistory(input: FindAllAscStocktakesInput): Promise<unknown[]>;
  countHistory(input: FindAllAscStocktakesInput): Promise<number>;
  findById(id: string): Promise<unknown | null>;
  findAccessoriesForStocktake(input: FindStocktakeAccessoriesInput): Promise<unknown[]>;
  countAccessoriesForStocktake(input: FindStocktakeAccessoriesInput): Promise<number>;
  findStockLevels(input: FindStocktakeStockLevelsInput): Promise<unknown[]>;
  countStockLevels(input: FindStocktakeStockLevelsInput): Promise<number>;
  createWithSideEffects(args: {
    ascCenterId: string;
    createdBy: string;
    notes?: string;
    items: Array<{ accessoryId: string; newQty: number; notes?: string }>;
  }): Promise<unknown>;
}
