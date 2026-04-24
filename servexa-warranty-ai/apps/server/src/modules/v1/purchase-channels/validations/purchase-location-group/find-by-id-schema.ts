import z from 'zod'

export const findPurchaseLocationGroupByIdSchema = z.object({
  groupId: z.uuidv7('Invalid group ID'),
})
