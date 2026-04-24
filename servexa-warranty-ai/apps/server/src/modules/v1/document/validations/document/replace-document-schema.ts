import { createDocumentSchema } from './create-document-schema'

export const replaceDocumentSchema = createDocumentSchema
export const updateDocumentSchema = createDocumentSchema.partial()
