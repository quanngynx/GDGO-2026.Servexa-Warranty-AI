import { z } from 'zod'

export const requestCreateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  role: z.enum(['superadmin', 'admin', 'cashier', 'manager']),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const requestUpdateUserSchema = requestCreateUserSchema
  .omit({ password: true })
  .extend({ password: z.string().min(8).optional().or(z.literal('')) })
  .partial({ firstName: true, lastName: true, username: true, email: true, phoneNumber: true, role: true })

export const requestListUsersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).default(10),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'username', 'fullName']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
})
