import z from 'zod'

import { ascCenterStatusSchema } from './create-asc-center-schema'

export const replaceAscCenterSchema = z.object({
  centerName: z.string().min(1, 'Center name is required'),
  centerCode: z.string().min(1, 'Center code is required'),
  companyName: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  email: z.string().email('Invalid email').optional().nullable().or(z.literal('')),
  address: z.string().optional().nullable(),
  wardId: z.string().optional().nullable(),
  provinceId: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  licenseNumber: z.string().optional().nullable(),
  status: ascCenterStatusSchema,
})

export const updateAscCenterSchema = replaceAscCenterSchema.partial()
