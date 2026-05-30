import z from 'zod'

const userStatusSchema = z.enum(['active', 'inactive', 'suspended'])

const roleReferenceSchema = z
  .object({
    roleId: z.string().uuid().optional(),
    roleName: z.string().min(1).optional(),
  })
  .refine(
    (data) => !(data.roleId && data.roleName),
    {
      message: 'Provide only one of roleId or roleName',
      path: ['roleId'],
    },
  )

export const updateUserSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must be at most 100 characters')
      .optional(),
    companyEmail: z.string().email('Invalid company email format').optional().nullable(),
    personalEmail: z.string().email('Invalid personal email format').optional().nullable(),
    phone: z.string().max(20, 'Phone must be at most 20 characters').optional().nullable(),
    avatar: z.string().url('Invalid avatar URL').optional().nullable(),
    status: userStatusSchema.optional(),
  })
  .and(roleReferenceSchema)
