import z from 'zod'

export const findTotalWarehouseByIdSchema = z.object({
  totalWarehouseId: z.uuidv7('Invalid total warehouse ID'),
})
