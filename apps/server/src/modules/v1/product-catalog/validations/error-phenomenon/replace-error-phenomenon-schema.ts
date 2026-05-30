import { createErrorPhenomenonSchema } from './create-error-phenomenon-schema'

export const replaceErrorPhenomenonSchema = createErrorPhenomenonSchema
export const updateErrorPhenomenonSchema = createErrorPhenomenonSchema.partial()
