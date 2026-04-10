import z from 'zod'

const roleReferenceSchema = z
  .object({
    roleId: z.string().uuid().optional(),
    roleName: z.string().min(1).optional(),
  })
  .refine(
    (data) => {
      return (Boolean(data.roleId) && !data.roleName) || (!data.roleId && Boolean(data.roleName))
    },
    {
      message: 'Provide exactly one of roleId or roleName',
      path: ['roleId'],
    },
  )

export const createUserSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must be at most 50 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must be at most 100 characters'),
    companyEmail: z.string().email('Invalid company email format').optional(),
    personalEmail: z.string().email('Invalid personal email format').optional(),
    phone: z.string().max(20, 'Phone must be at most 20 characters').optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must be at most 100 characters'),
    avatar: z.string().url('Invalid avatar URL').optional(),
  })
  .and(roleReferenceSchema)
