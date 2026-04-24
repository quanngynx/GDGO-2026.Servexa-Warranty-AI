import type { z } from 'zod'

import type {
  createPurchaseLocationSchema,
  findAllPurchaseLocationsSchema,
  replacePurchaseLocationSchema,
  updatePurchaseLocationSchema,
} from '../validations'

export type FindAllPurchaseLocationsInput = z.infer<typeof findAllPurchaseLocationsSchema>
export type CreatePurchaseLocationDto = z.infer<typeof createPurchaseLocationSchema>
export type ReplacePurchaseLocationDto = z.infer<typeof replacePurchaseLocationSchema>
export type UpdatePurchaseLocationDto = z.infer<typeof updatePurchaseLocationSchema>
