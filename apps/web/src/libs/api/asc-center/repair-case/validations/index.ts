import { z } from 'zod'

export const repairCaseStatusSchema = z.enum([
  'tiepnhan',
  'dangsua',
  'chocaplk',
  'choykienkhach',
  'choykiencongty',
  'khachkhongsua',
  'khongsuaduoc',
  'exchange_completed_asc',
  'cs_supported_asc',
  'suaxong',
  'dagiao',
  'hoanthanh',
  'huyphieu',
])

export const requestCreateRepairCaseSchema = z.object({
  ascCenterId: z.string().min(1),
  customerId: z.string().min(1),
  damageDescription: z.string().min(1),
  receivedDate: z.union([z.string(), z.date()]),
})

export const requestUpdateRepairCaseSchema = requestCreateRepairCaseSchema
  .partial()
  .extend({ status: repairCaseStatusSchema.optional() })

export const requestListRepairCasesSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).default(10),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'receivedDate', 'caseNumber', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  status: repairCaseStatusSchema.optional(),
  ascCenterId: z.string().optional(),
  customerId: z.string().optional(),
  modelId: z.string().optional(),
})
