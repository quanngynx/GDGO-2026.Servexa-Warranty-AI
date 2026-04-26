import { z } from 'zod'

export const updateAccessoryRequestItemSchema = z.object({
  params: z.object({
    id: z.uuidv7(),
    itemId: z.uuidv7(),
  }),
  body: z.object({
    requestedQuantity: z.number().int().positive().optional(),
    unitPrice: z.number().positive().optional(),
    notes: z.string().optional(),
  }),
})
