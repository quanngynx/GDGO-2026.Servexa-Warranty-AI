import { z } from 'zod';
import { paymentStatusSchema, warrantyFormSchema } from './payment-enums';

export const findAllPaymentsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional().default(''),
  ascCenterId: z.uuidv7().optional(),
  status: paymentStatusSchema.optional(),
  paymentPeriodId: z.uuidv7().optional(),
  repairCaseId: z.uuidv7().optional(),
  warrantyForm: warrantyFormSchema.optional(),
  createdAtFrom: z.iso.datetime().optional(),
  createdAtTo: z.iso.datetime().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'totalCost', 'caseNumber']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
