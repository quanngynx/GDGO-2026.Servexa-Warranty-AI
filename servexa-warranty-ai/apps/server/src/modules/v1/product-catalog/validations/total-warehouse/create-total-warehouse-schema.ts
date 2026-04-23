import z from 'zod'

export const totalWarehouseStatusSchema = z.enum(['active', 'inactive'])

export const createTotalWarehouseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  status: totalWarehouseStatusSchema.optional(),
})
