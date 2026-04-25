import z from 'zod'

export const createSolutionSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  instructions: z.string().min(1),
  estimatedTime: z.number().int().positive().optional().nullable(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional().default('medium'),
  requiredTools: z.string().max(1000).optional().nullable(),
  requiredParts: z.string().max(1000).optional().nullable(),
  status: z.enum(['active', 'inactive']).optional().default('active'),
})
