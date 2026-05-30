import type { z } from 'zod'

import type {
  createDocumentSchema,
  findAllDocumentsSchema,
  replaceDocumentSchema,
  updateDocumentSchema,
} from '../validations'

export type FindAllDocumentsInput = z.infer<typeof findAllDocumentsSchema>
export type CreateDocumentDto = z.infer<typeof createDocumentSchema>
export type ReplaceDocumentDto = z.infer<typeof replaceDocumentSchema>
export type UpdateDocumentDto = z.infer<typeof updateDocumentSchema>
