import type { z } from 'zod'

import {
  createTotalWarehouseSchema,
  replaceTotalWarehouseSchema,
  updateTotalWarehouseSchema,
} from '../validations'

export type CreateTotalWarehouseDto = z.infer<typeof createTotalWarehouseSchema>
export type ReplaceTotalWarehouseDto = z.infer<typeof replaceTotalWarehouseSchema>
export type UpdateTotalWarehouseDto = z.infer<typeof updateTotalWarehouseSchema>
