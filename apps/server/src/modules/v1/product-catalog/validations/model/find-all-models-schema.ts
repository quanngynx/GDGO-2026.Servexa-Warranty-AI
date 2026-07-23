import z from 'zod'

import { modelStatusSchema } from './create-model-schema'

export const findAllModelsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(1000).default(10),
  search: z.string().optional().default(''),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'modelCode']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: modelStatusSchema.optional(),
  categoryId: z.uuidv7().optional(),
})
