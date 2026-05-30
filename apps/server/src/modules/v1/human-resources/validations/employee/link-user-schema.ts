import z from 'zod'

export const linkEmployeeUserSchema = z.object({
  userId: z.uuidv7(),
})
