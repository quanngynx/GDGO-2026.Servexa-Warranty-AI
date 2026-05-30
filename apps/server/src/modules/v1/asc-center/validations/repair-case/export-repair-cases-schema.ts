import { z } from 'zod'

export const exportRepairCasesSchema = z.object({
  query: z.object({
    ascCenterId: z.uuidv7().optional(),
  }),
})
