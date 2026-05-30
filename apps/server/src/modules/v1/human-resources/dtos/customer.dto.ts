import type { z } from 'zod'

import {
  createCustomerSchema,
  replaceCustomerSchema,
  updateCustomerSchema,
} from '../validations'

export type CreateCustomerDto = z.infer<typeof createCustomerSchema>
export type ReplaceCustomerDto = z.infer<typeof replaceCustomerSchema>
export type UpdateCustomerDto = z.infer<typeof updateCustomerSchema>
