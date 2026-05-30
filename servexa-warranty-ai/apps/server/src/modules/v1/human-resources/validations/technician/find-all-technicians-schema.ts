import z from 'zod'

import { technicianSkillLevelSchema } from './create-technician-schema'

export const findAllTechniciansSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'updatedAt', 'experienceYears', 'completedCases']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  skillLevel: technicianSkillLevelSchema.optional(),
  isAvailable: z.coerce.boolean().optional(),
  ascCenterId: z.uuidv7().optional(),
  userId: z.uuidv7().optional(),
  ascCenterId: z.uuidv7().optional(),
})
