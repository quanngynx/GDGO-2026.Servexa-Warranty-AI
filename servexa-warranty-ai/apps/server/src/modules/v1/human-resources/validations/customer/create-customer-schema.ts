import z from 'zod'

const customerGroupSchema = z.enum([
  'individual',
  'dealer_store',
  'store_representative',
  'supplier',
  'invoice',
  'company',
])

export const createCustomerSchema = z.object({
  customerGroup: customerGroupSchema,
  fullName: z.string().min(1),
  phone1: z.string().min(1),
  phone2: z.string().optional(),
  email: z.email().optional(),
  provinceId: z.uuidv7().optional(),
  wardId: z.uuidv7().optional(),
  address: z.string().optional(),
  taxCode: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  contactPerson: z.string().optional(),
  ascCenterId: z.uuidv7().optional(),
})

export { customerGroupSchema }
