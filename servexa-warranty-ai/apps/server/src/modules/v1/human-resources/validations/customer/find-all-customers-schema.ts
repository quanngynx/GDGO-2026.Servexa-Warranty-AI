import z from 'zod'

import { customerGroupSchema } from './create-customer-schema'

export const findAllCustomersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional().default(''),
  sortBy: z.enum(['createdAt', 'updatedAt', 'fullName', 'phone1']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  customerGroup: customerGroupSchema.optional(),
  ascCenterId: z.uuidv7().optional(),
})
