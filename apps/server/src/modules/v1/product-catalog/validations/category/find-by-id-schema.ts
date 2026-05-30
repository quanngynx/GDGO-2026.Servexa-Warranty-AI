import z from 'zod'

export const findCategoryByIdSchema = z.object({
  categoryId: z.uuidv7(),
})
