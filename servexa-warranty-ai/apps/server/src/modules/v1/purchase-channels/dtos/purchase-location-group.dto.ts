import type { z } from 'zod'

import type {
  createPurchaseLocationGroupSchema,
  findAllPurchaseLocationGroupsSchema,
  replacePurchaseLocationGroupSchema,
  updatePurchaseLocationGroupSchema,
} from '../validations'

export type FindAllPurchaseLocationGroupsInput = z.infer<typeof findAllPurchaseLocationGroupsSchema>
export type CreatePurchaseLocationGroupDto = z.infer<typeof createPurchaseLocationGroupSchema>
export type ReplacePurchaseLocationGroupDto = z.infer<typeof replacePurchaseLocationGroupSchema>
export type UpdatePurchaseLocationGroupDto = z.infer<typeof updatePurchaseLocationGroupSchema>
