import { createModelSchema } from './create-model-schema'

export const replaceModelSchema = createModelSchema

export const updateModelSchema = replaceModelSchema.partial()
