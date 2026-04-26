import { z } from 'zod'
import {
  accessoryRequestStatusSchema,
  statusRecallSchema,
  accessoryRequestUrgencySchema,
} from './accessory-request-enums'

export const findAllAccessoryRequestsSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    status: accessoryRequestStatusSchema.optional(),
    statusRecall: statusRecallSchema.optional(),
    urgency: accessoryRequestUrgencySchema.optional(),
    ascCenterId: z.uuidv7().optional(),
    repairCaseId: z.uuidv7().optional(),
    requestedBy: z.uuidv7().optional(),
    approvedBy: z.uuidv7().optional(),
    requestDateFrom: z.coerce.date().optional(),
    requestDateTo: z.coerce.date().optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'requestDate', 'requestNumber', 'urgency']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
})
