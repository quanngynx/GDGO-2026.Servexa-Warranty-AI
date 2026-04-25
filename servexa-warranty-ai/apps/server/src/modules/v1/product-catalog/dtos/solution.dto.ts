import z from 'zod'
import {
  createSolutionSchema,
  replaceSolutionSchema,
  updateSolutionSchema,
} from '../validations/solution'

export type CreateSolutionDto = z.infer<typeof createSolutionSchema>
export type ReplaceSolutionDto = z.infer<typeof replaceSolutionSchema>
export type UpdateSolutionDto = z.infer<typeof updateSolutionSchema>
