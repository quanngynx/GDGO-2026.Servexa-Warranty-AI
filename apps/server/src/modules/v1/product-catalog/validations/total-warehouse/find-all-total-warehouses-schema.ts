import z from 'zod'

const totalWarehouseStatusSchema = z.enum(['active', 'inactive'])

export const findAllTotalWarehousesSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(1000).default(10),
  search: z.string().optional().default(''),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: totalWarehouseStatusSchema.optional(),
})
