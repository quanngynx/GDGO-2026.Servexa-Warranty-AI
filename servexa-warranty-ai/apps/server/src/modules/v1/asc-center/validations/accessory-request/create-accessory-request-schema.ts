import { z } from 'zod'
import { accessoryRequestUrgencySchema } from './accessory-request-enums'

export const createAccessoryRequestItemSchema = z.object({
  accessoryId: z.uuidv7(),
  requestedQuantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  notes: z.string().optional(),
})

export const createAccessoryRequestSchema = z.object({
  body: z.object({
    ascCenterId: z.uuidv7(),
    repairCaseId: z.uuidv7().optional(),
    requestDate: z.coerce.date(),
    urgency: accessoryRequestUrgencySchema.optional(),
    justification: z.string().optional(),
    items: z.array(createAccessoryRequestItemSchema).min(1, 'At least one item is required'),
  }),
})
