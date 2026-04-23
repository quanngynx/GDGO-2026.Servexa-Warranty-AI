import z from 'zod'

export const findModelByIdSchema = z.object({
  modelId: z.uuidv7(),
})
