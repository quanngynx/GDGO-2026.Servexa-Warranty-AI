import type { z } from 'zod'

import { createModelSchema, replaceModelSchema, updateModelSchema } from '../validations'

export type CreateModelDto = z.infer<typeof createModelSchema>
export type ReplaceModelDto = z.infer<typeof replaceModelSchema>
export type UpdateModelDto = z.infer<typeof updateModelSchema>
