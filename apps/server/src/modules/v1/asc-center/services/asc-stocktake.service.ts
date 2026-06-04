import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant';
import { createOperationalError } from '@/middlewares/error-middleware';
import { buildPagination } from '@/utils/pagination';

import type { IAscStocktakeService } from '../interfaces/asc-stocktake-service.interface';
import type { IAscStocktakeRepository } from '../interfaces/asc-stocktake-repository.interface';
import { AscStocktakeRepository } from '../repositories/asc-stocktake.repository';
import type {
  FindAllAscStocktakesInput,
  FindStocktakeAccessoriesInput,
  FindStocktakeStockLevelsInput,
  CreateAscStocktakeInput,
} from '../dtos/asc-stocktake.dto';
import type { AscStocktakeDetail, AscStocktakeStockLevelRow } from '../asc-stocktake.types';
import type { BasePagination } from 'src/types/pagination';

export class AscStocktakeService implements IAscStocktakeService {
  constructor(
    private readonly repository: IAscStocktakeRepository = new AscStocktakeRepository(),
  ) {}

  async findHistoryByCenter(input: FindAllAscStocktakesInput) {
    const [items, total] = await Promise.all([
      this.repository.findManyHistory(input),
      this.repository.countHistory(input),
    ]);

    return {
      items,
      pagination: buildPagination(input.page, input.limit, total),
    };
  }

  async findOneById(id: string): Promise<AscStocktakeDetail> {
    const found = await this.repository.findById(id);
    if (!found) {
      throw createOperationalError('Stocktake not found', HTTP_RESPONSE_CODE.NOT_FOUND);
    }
    return found;
  }

  async findAccessoriesForStocktake(input: FindStocktakeAccessoriesInput) {
    const [rawItems, total] = await Promise.all([
      this.repository.findAccessoriesForStocktake(input),
      this.repository.countAccessoriesForStocktake(input),
    ]);

    // Flatten stockLevels relation
    const items = (rawItems as any[]).map((item) => {
      const stockLevels = item.stockLevels && item.stockLevels.length > 0 ? item.stockLevels[0] : null;
      return {
        ...item,
        stockLevels: undefined,
        currentStock: stockLevels?.currentStock ?? 0,
        reservedStock: stockLevels?.reservedStock ?? 0,
        minStockLevel: stockLevels?.minStockLevel ?? 0,
        lastUpdated: stockLevels?.lastUpdated ?? null,
      };
    });

    return {
      items,
      pagination: buildPagination(input.page, input.limit, total),
    };
  }

  async findStockLevels(input: FindStocktakeStockLevelsInput): Promise<{ items: AscStocktakeStockLevelRow[] | null; pagination: BasePagination }> {
    const [items, total] = await Promise.all([
      this.repository.findStockLevels(input),
      this.repository.countStockLevels(input),
    ]);

    return {
      items,
      pagination: buildPagination(input.page, input.limit, total),
    };
  }

  async create(input: CreateAscStocktakeInput, userId: string): Promise<AscStocktakeDetail | null> {
    try {
      const result = await this.repository.createWithSideEffects({
        ...input,
        createdBy: userId,
      });
      return result;
    } catch (error: any) {
      const msg = error.message || '';
      if (msg.includes('NOT_FOUND')) {
        throw createOperationalError(msg, HTTP_RESPONSE_CODE.NOT_FOUND);
      }
      if (msg.includes('BAD_REQUEST')) {
        throw createOperationalError(msg, HTTP_RESPONSE_CODE.BAD_REQUEST);
      }
      throw error;
    }
  }
}
