import { z } from 'zod'
import { repairCaseStatusSchema } from './repair-case-enums'

export const findAllRepairCasesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    search: z.string().optional(),
    ascCenterId: z.uuidv7().optional(),
    status: repairCaseStatusSchema.optional(),
    customerId: z.uuidv7().optional(),
    serialNumber: z.string().optional(),
    dateFrom: z.coerce.date().optional(),
    dateTo: z.coerce.date().optional(),
    sortBy: z.enum(['receivedDate', 'caseNumber', 'createdAt', 'updatedAt']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
})
