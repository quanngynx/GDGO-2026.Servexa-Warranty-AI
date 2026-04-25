import { createSolutionSchema } from './create-solution-schema'

export const replaceSolutionSchema = createSolutionSchema
export const updateSolutionSchema = createSolutionSchema.partial()
