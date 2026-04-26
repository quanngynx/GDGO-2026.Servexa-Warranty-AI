import { z } from 'zod';

export const findAllPaymentPeriodsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional().default(''),
  startDateFrom: z.iso.datetime().optional(),
  startDateTo: z.iso.datetime().optional(),
  endDateFrom: z.iso.datetime().optional(),
  endDateTo: z.iso.datetime().optional(),
  sortBy: z.enum(['startDate', 'endDate', 'name']).default('startDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
