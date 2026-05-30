import type { z } from 'zod'

import type {
  createWarrantyPolicySchema,
  replaceWarrantyPolicySchema,
  resolveWarrantyPolicySchema,
  updateWarrantyPolicySchema,
} from '../validations'

export type CreateWarrantyPolicyDto = z.infer<typeof createWarrantyPolicySchema>
export type ReplaceWarrantyPolicyDto = z.infer<typeof replaceWarrantyPolicySchema>
export type UpdateWarrantyPolicyDto = z.infer<typeof updateWarrantyPolicySchema>
export type ResolveWarrantyPolicyDto = z.infer<typeof resolveWarrantyPolicySchema>
