import z from 'zod'

const userStatusSchema = z.enum(['active', 'inactive', 'suspended'])

export const findAllUsersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional().default(''),
  sortBy: z.enum(['createdAt', 'updatedAt', 'username', 'fullName']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: userStatusSchema.optional(),
})
