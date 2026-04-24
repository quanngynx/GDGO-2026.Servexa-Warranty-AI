import z from 'zod'

export const replacePurchaseLocationGroupSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  code: z.string().min(1, 'Code is required').trim(),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0),
  isActive: z.boolean(),
})

export const updatePurchaseLocationGroupSchema = replacePurchaseLocationGroupSchema.partial()
