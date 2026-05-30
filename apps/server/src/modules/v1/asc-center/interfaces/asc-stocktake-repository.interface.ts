import type {
  FindAllAscStocktakesInput,
  FindStocktakeAccessoriesInput,
  FindStocktakeStockLevelsInput,
} from '../dtos/asc-stocktake.dto';
import type {
  AscStocktakeAccessoryRow,
  AscStocktakeDetail,
  AscStocktakeListItem,
  AscStocktakeStockLevelRow,
} from '../asc-stocktake.types';

export interface IAscStocktakeRepository {
  findManyHistory(input: FindAllAscStocktakesInput): Promise<AscStocktakeListItem[]>;
  countHistory(input: FindAllAscStocktakesInput): Promise<number>;
  findById(id: string): Promise<AscStocktakeDetail | null>;
  findAccessoriesForStocktake(
    input: FindStocktakeAccessoriesInput,
  ): Promise<AscStocktakeAccessoryRow[]>;
  countAccessoriesForStocktake(input: FindStocktakeAccessoriesInput): Promise<number>;
  findStockLevels(input: FindStocktakeStockLevelsInput): Promise<AscStocktakeStockLevelRow[]>;
  countStockLevels(input: FindStocktakeStockLevelsInput): Promise<number>;
  createWithSideEffects(args: {
    ascCenterId: string;
    createdBy: string;
    notes?: string;
    items: Array<{ accessoryId: string; newQty: number; notes?: string }>;
  }): Promise<AscStocktakeDetail | null>;
}
