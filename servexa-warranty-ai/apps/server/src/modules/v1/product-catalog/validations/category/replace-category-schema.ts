import z from 'zod'

import { categoryStatusSchema, moneySchema } from './create-category-schema'

export const replaceCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: categoryStatusSchema,
  laborCost: moneySchema,
  inspectionCost: moneySchema,
})

export const updateCategorySchema = replaceCategorySchema.partial()
