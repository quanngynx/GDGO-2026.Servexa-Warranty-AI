import { z } from 'zod'

export const findAccessoryRequestByIdSchema = z.object({
  params: z.object({
    id: z.uuidv7(),
  }),
})

export const findAccessoryRequestItemByIdSchema = z.object({
  params: z.object({
    id: z.uuidv7(),
    itemId: z.uuidv7(),
  }),
})
