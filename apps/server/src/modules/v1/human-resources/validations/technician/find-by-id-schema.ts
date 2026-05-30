import z from 'zod'

export const findTechnicianByIdSchema = z.object({
  technicianProfileId: z.uuidv7(),
})
