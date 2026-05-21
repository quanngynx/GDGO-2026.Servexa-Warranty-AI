import { z } from 'zod'

/** TanStack Router search params for paginated admin list pages (Zod 4-safe defaults). */
export const adminListSearchSchema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),
  search: z.string().default(''),
})

export const adminListWithStatusSearchSchema = adminListSearchSchema.extend({
  status: z.array(z.string()).default([]),
})

export const adminListWithIsActiveSearchSchema = adminListSearchSchema.extend({
  isActive: z.array(z.string()).default([]),
})

export const adminListWithWarehouseSearchSchema = adminListWithStatusSearchSchema.extend({
  totalWarehouseId: z.string().default(''),
})

/** Repair cases list (GENERAL) — URL sync for pagination, search, filters */
export const repairCasesListSearchSchema = adminListSearchSchema.extend({
  caseId: z.string().optional(),
  status: z.array(z.string()).default([]),
  ascCenterId: z.array(z.string()).default([]),
})
