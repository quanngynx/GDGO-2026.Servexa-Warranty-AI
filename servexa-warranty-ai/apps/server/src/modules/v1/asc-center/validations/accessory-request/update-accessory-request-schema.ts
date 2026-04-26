import { z } from 'zod'
import { accessoryRequestUrgencySchema } from './accessory-request-enums'

export const updateAccessoryRequestSchema = z.object({
  params: z.object({
    id: z.uuidv7(),
  }),
  body: z.object({
    repairCaseId: z.uuidv7().optional(),
    requestDate: z.coerce.date().optional(),
    urgency: accessoryRequestUrgencySchema.optional(),
    justification: z.string().optional(),
  }),
})
