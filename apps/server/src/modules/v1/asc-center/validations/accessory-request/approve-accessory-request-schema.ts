import { z } from 'zod'

export const approveAccessoryRequestItemSchema = z.object({
  itemId: z.uuidv7(),
  approvedQuantity: z.number().int().nonnegative(),
})

export const approveAccessoryRequestSchema = z.object({
  params: z.object({
    id: z.uuidv7(),
  }),
  body: z.object({
    items: z.array(approveAccessoryRequestItemSchema).min(1, 'At least one item is required'),
  }),
})
