import z from 'zod'

import { departmentSchema, employeeStatusSchema, positionSchema } from './create-employee-schema'

export const findAllEmployeesSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional().default(''),
  sortBy: z.enum(['createdAt', 'updatedAt', 'fullName', 'employeeCode']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: employeeStatusSchema.optional(),
  department: departmentSchema.optional(),
  position: positionSchema.optional(),
  ascCenterId: z.uuidv7().optional(),
})
