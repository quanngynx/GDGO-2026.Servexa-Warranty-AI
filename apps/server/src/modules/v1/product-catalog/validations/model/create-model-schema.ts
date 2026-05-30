import z from 'zod'

const modelStatusSchema = z.enum(['active', 'inactive'])

const optionalMoney = z
  .union([z.null(), z.number().nonnegative()])
  .optional()

export const createModelSchema = z.object({
  modelCode: z.string().min(1, 'Model code is required'),
  name: z.string().min(1, 'Name is required'),
  categoryId: z.uuidv7(),
  image: z.string().optional(),
  status: modelStatusSchema.optional(),
  stockNumber: z.number().int().nonnegative().optional(),
  laborCost: optionalMoney,
  inspectionCost: optionalMoney,
  itemName: z.string().optional(),
  globalCategory: z.string().optional(),
  largeCategory: z.string().optional(),
  mediumCategory: z.string().optional(),
  productName: z.string().optional(),
  productDescription: z.string().optional(),
})

export { modelStatusSchema, optionalMoney }
