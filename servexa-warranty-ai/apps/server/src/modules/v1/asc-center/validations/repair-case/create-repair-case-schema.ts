import { z } from 'zod'
import { repairCaseBaseShape } from './repair-case-enums'

export const createRepairCaseSchema = z.object({
  body: z.object({
    ascCenterId: z.uuidv7(),
    ...repairCaseBaseShape,
  }),
})
