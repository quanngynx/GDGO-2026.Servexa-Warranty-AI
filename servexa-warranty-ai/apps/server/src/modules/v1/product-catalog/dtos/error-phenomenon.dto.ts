import z from 'zod'
import {
  createErrorPhenomenonSchema,
  replaceErrorPhenomenonSchema,
  updateErrorPhenomenonSchema,
} from '../validations/error-phenomenon'

export type CreateErrorPhenomenonDto = z.infer<typeof createErrorPhenomenonSchema>
export type ReplaceErrorPhenomenonDto = z.infer<typeof replaceErrorPhenomenonSchema>
export type UpdateErrorPhenomenonDto = z.infer<typeof updateErrorPhenomenonSchema>
