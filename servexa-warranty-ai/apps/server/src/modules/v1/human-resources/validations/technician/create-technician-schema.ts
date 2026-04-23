import z from 'zod'

const technicianSkillLevelSchema = z.enum(['basic', 'intermediate', 'advanced', 'expert'])
const technicianSpecializationSchema = z.enum([
  'electrical_appliances',
  'plastic_products',
  'glass_products',
  'sealing_systems',
  'food_safety',
  'general_repair',
])

export const createTechnicianSchema = z.object({
  userId: z.uuidv7(),
  skillLevel: technicianSkillLevelSchema.optional(),
  specializations: z.array(technicianSpecializationSchema),
  certifications: z.string().optional(),
  experienceYears: z.number().int().nonnegative().optional(),
  maxConcurrentCases: z.number().int().positive().optional(),
  isAvailable: z.boolean().optional(),
  averageRepairTime: z.number().int().nonnegative().optional(),
  customerRating: z.union([z.null(), z.number().min(0).max(5)]).optional(),
  completedCases: z.number().int().nonnegative().optional(),
})

export { technicianSkillLevelSchema, technicianSpecializationSchema }
