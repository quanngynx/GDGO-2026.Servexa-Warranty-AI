import type { z } from 'zod'

import {
  createEmployeeSchema,
  linkEmployeeUserSchema,
  replaceEmployeeSchema,
  updateEmployeeSchema,
} from '../validations'

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>
export type ReplaceEmployeeDto = z.infer<typeof replaceEmployeeSchema>
export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>
export type LinkEmployeeUserDto = z.infer<typeof linkEmployeeUserSchema>
