import z from 'zod'

export const findPurchaseLocationByIdSchema = z.object({
  locationId: z.uuidv7('Invalid location ID'),
})
