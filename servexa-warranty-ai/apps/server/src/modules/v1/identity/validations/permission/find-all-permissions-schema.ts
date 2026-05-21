import z from 'zod'

export const findAllPermissionsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional().default(''),
  sortBy: z.enum(['createdAt', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})
