import z from 'zod'

export const excelImportErrorPhenomenonRowSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  categoryId: z.uuidv7().optional().nullable(),
  status: z.enum(['active', 'inactive']).optional().default('active'),
})
