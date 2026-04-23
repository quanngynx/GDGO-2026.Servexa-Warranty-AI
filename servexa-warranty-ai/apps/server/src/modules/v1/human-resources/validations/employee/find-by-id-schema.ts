import z from 'zod'

export const findEmployeeByIdSchema = z.object({
  employeeId: z.uuidv7(),
})
