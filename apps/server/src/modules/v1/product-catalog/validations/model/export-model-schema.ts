import { z } from 'zod';

export const exportModelSchema = z.object({
  format: z.literal('xlsx'),
  filters: z
    .object({
      keyword: z.string().optional(),
      brandId: z.string().optional(),
      categoryId: z.string().optional(),
      status: z.array(z.string()).optional(),
      includeArchived: z.boolean().optional(),
      createdFrom: z.string().optional(),
      createdTo: z.string().optional(),
    })
    .optional(),
  columns: z.array(z.string()).optional(),
  sort: z
    .object({
      field: z.string(),
      direction: z.enum(['asc', 'desc']),
    })
    .optional(),
});
