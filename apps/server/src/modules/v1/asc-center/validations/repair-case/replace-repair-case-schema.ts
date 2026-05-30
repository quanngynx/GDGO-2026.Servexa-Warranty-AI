import { z } from 'zod'
import { repairCaseBaseShape } from './repair-case-enums'

export const replaceRepairCaseSchema = z.object({
  params: z.object({
    id: z.uuidv7(),
  }),
  body: z.object(repairCaseBaseShape).required({
    customerId: true,
    damageDescription: true,
    receivedDate: true,
  }),
})
