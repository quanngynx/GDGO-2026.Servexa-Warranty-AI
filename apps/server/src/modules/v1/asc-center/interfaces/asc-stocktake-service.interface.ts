import type { BasePagination } from '@/types/pagination';
import type {
  FindAllAscStocktakesInput,
  FindStocktakeAccessoriesInput,
  FindStocktakeStockLevelsInput,
  CreateAscStocktakeInput,
} from '../dtos/asc-stocktake.dto';
import type { AscAccessoryStock, AscStocktake, AscStocktakeItem, Prisma } from '@servexa-warranty-ai/db/prisma/client';

export interface IAscStocktakeService {
  findHistoryByCenter(input: FindAllAscStocktakesInput): Promise<{ items: (AscStocktake & Prisma.AscStocktakeInclude)[] | null, pagination: BasePagination }>;
  findOneById(id: string): Promise<(AscStocktake & Prisma.AscStocktakeInclude) | null>;
  findAccessoriesForStocktake(input: FindStocktakeAccessoriesInput): Promise<{ items: (AscStocktakeItem & Prisma.AscStocktakeItemInclude)[] | null, pagination: BasePagination }>;
  findStockLevels(input: FindStocktakeStockLevelsInput): Promise<{ items: (AscAccessoryStock & Prisma.AscAccessoryStockInclude)[] | null, pagination: BasePagination }>;
  create(input: CreateAscStocktakeInput, userId: string): Promise<(AscStocktake & Prisma.AscStocktakeInclude) | null>;
}
