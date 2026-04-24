import z from 'zod'

export const findDocumentByIdSchema = z.object({
  documentId: z.uuidv7(),
})
