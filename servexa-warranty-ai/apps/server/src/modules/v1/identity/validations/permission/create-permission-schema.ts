import z from 'zod'

export const createPermissionSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(500).optional(),
})
