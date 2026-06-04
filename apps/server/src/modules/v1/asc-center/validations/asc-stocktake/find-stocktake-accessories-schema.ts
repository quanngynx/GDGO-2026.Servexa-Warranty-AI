import { z } from 'zod';
import { AccessoryStatus } from '@/core/infra/prisma/generated/client';

export const findStocktakeAccessoriesSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional().default(''),
  categoryId: z.uuidv7().optional(),
  status: z.enum(AccessoryStatus).optional().default(AccessoryStatus.active),
  sortBy: z.enum(['name', 'partNumber', 'createdAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
