import { totalWarehouseStatusSchema } from './create-total-warehouse-schema'

import z from 'zod'

export const replaceTotalWarehouseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  status: totalWarehouseStatusSchema,
})

export const updateTotalWarehouseSchema = replaceTotalWarehouseSchema.partial()
