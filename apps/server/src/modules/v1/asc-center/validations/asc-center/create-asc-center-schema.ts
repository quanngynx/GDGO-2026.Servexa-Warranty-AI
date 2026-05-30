import z from 'zod'

export const ascCenterStatusSchema = z.enum(['active', 'inactive', 'suspended'])

export const createAscCenterSchema = z.object({
  centerName: z.string().min(1, 'Center name is required'),
  centerCode: z.string().min(1, 'Center code is required'),
  companyName: z.string().optional(),
  region: z.string().optional(),
  email: z.email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  wardId: z.string().optional(),
  provinceId: z.string().optional(),
  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
  status: ascCenterStatusSchema.optional(),
})
