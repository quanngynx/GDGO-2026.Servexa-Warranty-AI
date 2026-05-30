import z from 'zod'

import { ascCenterStatusSchema } from './create-asc-center-schema'

export const findAllAscCentersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional().default(''),
  sortBy: z.enum(['createdAt', 'updatedAt', 'centerName']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: ascCenterStatusSchema.optional(),
})
