import z from 'zod'

export const updatePermissionSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(500).nullable().optional(),
})
