import { z } from 'zod'
import { repairCaseImageTypeSchema } from './repair-case-enums'

export const uploadImagesSchema = z.object({
  params: z.object({
    id: z.uuidv7(),
  }),
  body: z.object({
    imageType: repairCaseImageTypeSchema,
    description: z.string().optional(),
  }),
})
