import z from 'zod'

const categoryStatusSchema = z.enum(['active', 'inactive'])
const moneySchema = z.number().nonnegative()

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: categoryStatusSchema.optional(),
  laborCost: moneySchema.optional(),
  inspectionCost: moneySchema.optional(),
})

export { categoryStatusSchema, moneySchema }
