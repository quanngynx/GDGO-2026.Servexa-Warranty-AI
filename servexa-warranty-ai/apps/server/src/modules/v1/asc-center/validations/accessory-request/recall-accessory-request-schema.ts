import { z } from 'zod'
import { statusRecallSchema } from './accessory-request-enums'

export const recallAccessoryRequestSchema = z.object({
  params: z.object({
    id: z.uuidv7(),
  }),
  body: z.object({
    statusRecall: statusRecallSchema,
  }),
})
