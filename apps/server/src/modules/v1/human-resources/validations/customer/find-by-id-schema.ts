import z from 'zod'

export const findCustomerByIdSchema = z.object({
  customerId: z.uuidv7(),
})
