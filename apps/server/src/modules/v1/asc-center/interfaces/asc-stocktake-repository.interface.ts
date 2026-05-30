import type { AscAccessoryStock, AscStocktake, AscStocktakeItem, Prisma } from '@servexa-warranty-ai/db/prisma/client';
import type {
  FindAllAscStocktakesInput,
  FindStocktakeAccessoriesInput,
  FindStocktakeStockLevelsInput,
} from '../dtos/asc-stocktake.dto';

export interface IAscStocktakeRepository {
  findManyHistory(input: FindAllAscStocktakesInput): Promise<(AscStocktake & Prisma.AscStocktakeInclude)[] | null>;
  countHistory(input: FindAllAscStocktakesInput): Promise<number>;
  findById(id: string): Promise<(AscStocktake & Prisma.AscStocktakeInclude) | null>;
  findAccessoriesForStocktake(input: FindStocktakeAccessoriesInput): Promise<(AscStocktakeItem & Prisma.AscStocktakeItemInclude)[] | null>;
  countAccessoriesForStocktake(input: FindStocktakeAccessoriesInput): Promise<number>;
  findStockLevels(input: FindStocktakeStockLevelsInput): Promise<(AscAccessoryStock & Prisma.AscAccessoryStockInclude)[] | null>;
  countStockLevels(input: FindStocktakeStockLevelsInput): Promise<number>;
  createWithSideEffects(args: {
    ascCenterId: string;
    createdBy: string;
    notes?: string;
    items: Array<{ accessoryId: string; newQty: number; notes?: string }>;
  }): Promise<(AscStocktake & Prisma.AscStocktakeInclude) | null>;
}
