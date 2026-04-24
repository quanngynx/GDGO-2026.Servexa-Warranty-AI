import z from 'zod'

import { documentTypeSchema } from './document-type-schema'

export const createDocumentSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(1000).optional(),
  detailedDescription: z.string().trim().optional(),
  documentType: documentTypeSchema,
  ascCenterId: z.uuidv7().optional(),
})
