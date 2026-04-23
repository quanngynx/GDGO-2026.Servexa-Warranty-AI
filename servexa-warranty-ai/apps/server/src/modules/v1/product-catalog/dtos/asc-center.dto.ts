import type { z } from 'zod'

import { createAscCenterSchema, replaceAscCenterSchema, updateAscCenterSchema } from '../validations'

export type CreateAscCenterDto = z.infer<typeof createAscCenterSchema>
export type ReplaceAscCenterDto = z.infer<typeof replaceAscCenterSchema>
export type UpdateAscCenterDto = z.infer<typeof updateAscCenterSchema>
