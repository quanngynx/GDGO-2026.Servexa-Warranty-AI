import z from 'zod'

export const findByIdSchema = z.object({
  id: z.uuidv7(),
})
