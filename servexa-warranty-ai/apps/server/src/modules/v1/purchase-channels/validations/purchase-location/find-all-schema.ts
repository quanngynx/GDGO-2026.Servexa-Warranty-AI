import z from 'zod'

export const findAllPurchaseLocationsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional().default(''),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'sortOrder']).default('sortOrder'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  isActive: z.coerce.boolean().optional(),
  groupId: z.uuidv7('Invalid group ID').optional(),
})
