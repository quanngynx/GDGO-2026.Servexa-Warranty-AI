import { z } from 'zod'

export const grantAccessoriesSchema = z.object({
  params: z.object({
    id: z.uuidv7(),
  }),
  body: z.object({
    items: z
      .array(
        z.object({
          accessoryId: z.uuidv7(),
          quantity: z.coerce.number().int().min(1),
          unitPrice: z.coerce.number().min(0).optional(),
          notes: z.string().optional(),
        }),
      )
      .min(1)
      .max(50),
  }),
})
