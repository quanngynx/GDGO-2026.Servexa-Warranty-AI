import type { BasePagination } from "@/types/pagination";
import type {
  FindAllAscStocktakesInput,
  FindStocktakeAccessoriesInput,
  FindStocktakeStockLevelsInput,
  CreateAscStocktakeInput,
} from "../dtos/asc-stocktake.dto";
import type {
  AscStocktakeAccessoryRow,
  AscStocktakeDetail,
  AscStocktakeListItem,
  AscStocktakeStockLevelRow,
} from "../asc-stocktake.types";

export interface IAscStocktakeService {
  findHistoryByCenter(
    input: FindAllAscStocktakesInput,
  ): Promise<{
    items: AscStocktakeListItem[] | null;
    pagination: BasePagination;
  }>;
  findOneById(id: string): Promise<AscStocktakeDetail>;
  findAccessoriesForStocktake(
    input: FindStocktakeAccessoriesInput,
  ): Promise<{
    items: AscStocktakeAccessoryRow[] | null;
    pagination: BasePagination;
  }>;
  findStockLevels(
    input: FindStocktakeStockLevelsInput,
  ): Promise<{
    items: AscStocktakeStockLevelRow[] | null;
    pagination: BasePagination;
  }>;
  create(
    input: CreateAscStocktakeInput,
    userId: string,
  ): Promise<AscStocktakeDetail | null>;
}
