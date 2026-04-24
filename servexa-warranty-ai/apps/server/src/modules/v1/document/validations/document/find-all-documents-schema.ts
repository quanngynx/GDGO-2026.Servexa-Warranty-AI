import z from 'zod'

import { documentTypeSchema } from './document-type-schema'

export const findAllDocumentsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().trim().optional(),
  documentType: documentTypeSchema.optional(),
  ascCenterId: z.uuidv7().optional(),
  includeDeleted: z.coerce.boolean().default(false),
})
