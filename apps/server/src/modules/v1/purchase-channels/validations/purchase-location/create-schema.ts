import z from 'zod'

export const createPurchaseLocationSchema = z.object({
  groupId: z.uuidv7('Invalid group ID'),
  name: z.string().min(1, 'Name is required').trim(),
  code: z.string().min(1, 'Code is required').trim(),
  description: z.string().optional().nullable(),
  website: z.url('Invalid URL').optional().nullable().or(z.literal('')),
  address: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})
