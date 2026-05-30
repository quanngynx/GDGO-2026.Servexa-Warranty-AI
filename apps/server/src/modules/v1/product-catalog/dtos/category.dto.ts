import type { z } from 'zod'

import {
  createCategorySchema,
  replaceCategorySchema,
  updateCategorySchema,
} from '../validations'

export type CreateCategoryDto = z.infer<typeof createCategorySchema>
export type ReplaceCategoryDto = z.infer<typeof replaceCategorySchema>
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>
