import type { z } from 'zod'

import {
  createTechnicianSchema,
  replaceTechnicianSchema,
  updateTechnicianSchema,
} from '../validations'

export type CreateTechnicianDto = z.infer<typeof createTechnicianSchema>
export type ReplaceTechnicianDto = z.infer<typeof replaceTechnicianSchema>
export type UpdateTechnicianDto = z.infer<typeof updateTechnicianSchema>
