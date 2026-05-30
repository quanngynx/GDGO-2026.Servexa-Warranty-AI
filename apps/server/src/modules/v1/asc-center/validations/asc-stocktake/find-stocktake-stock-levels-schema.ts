import { z } from 'zod';

export const findStocktakeStockLevelsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional().default(''),
  categoryId: z.uuidv7().optional(),
  belowMin: z.coerce.boolean().optional(),
  sortBy: z.enum(['lastUpdated', 'currentStock', 'name']).default('lastUpdated'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
