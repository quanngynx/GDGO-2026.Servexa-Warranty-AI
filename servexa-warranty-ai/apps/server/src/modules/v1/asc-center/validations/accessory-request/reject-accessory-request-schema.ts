import { z } from 'zod'

export const rejectAccessoryRequestSchema = z.object({
  params: z.object({
    id: z.uuidv7(),
  }),
  body: z.object({
    rejectionReason: z.string().min(1, 'Rejection reason is required'),
  }),
})
