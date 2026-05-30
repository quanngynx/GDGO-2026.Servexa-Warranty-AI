import z from 'zod'

export const findUserByIdSchema = z.object({
  userId: z.uuidv7('Invalid user id format'),
})
