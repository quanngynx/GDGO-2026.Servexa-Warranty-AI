import { z } from 'zod'
import { repairCaseBaseShape } from './repair-case-enums'

export const updateRepairCaseSchema = z.object({
  params: z.object({
    id: z.uuidv7(),
  }),
  body: z.object(repairCaseBaseShape).partial(),
})
