import z from 'zod'

const accessoryStatusSchema = z.enum(['active', 'inactive'])

const stockLevelSchema = z.coerce.number().int().min(0)

const sortOrderSchema = z.enum(['asc', 'desc'])

const sortBySchema = z.enum(['createdAt', 'updatedAt', 'name'])

export const createAccessorySchema = z.object({
  categoryId: z.uuidv7(),
  name: z.string().trim().min(1).max(255),
  partNumber: z.string().trim().min(1).max(255),
  description: z.string().trim().max(2000).optional().nullable(),
  image: z.string().trim().max(2048).optional().nullable(),
  partGroupNumber: z.string().trim().max(255).optional().nullable(),
  partGroupName: z.string().trim().max(255).optional().nullable(),
  partDescription: z.string().trim().max(2000).optional().nullable(),
  itemNumber: z.string().trim().max(255).optional().nullable(),
  englishName: z.string().trim().max(255).optional().nullable(),
  customerPrice: z.string().trim().max(255).optional().nullable(),
  unitPrice: z.coerce.number().nonnegative().optional().nullable(),
  stockQuantity: stockLevelSchema.optional(),
  minStockLevel: stockLevelSchema.optional(),
  supplier: z.string().trim().max(255).optional().nullable(),
  status: accessoryStatusSchema.optional(),
})

export const replaceAccessorySchema = createAccessorySchema

export const updateAccessorySchema = createAccessorySchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field must be provided for update',
})

export const findAllAccessoriesSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(1000).default(10),
  search: z.string().optional().default(''),
  sortBy: sortBySchema.default('createdAt'),
  sortOrder: sortOrderSchema.default('desc'),
  status: accessoryStatusSchema.optional(),
  categoryId: z.uuidv7().optional(),
  totalWarehouseIds: z.string().optional(),
  ascCenterIds: z.string().optional(),
})

export const findAllAccessoryStocksSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(1000).default(10),
  search: z.string().optional().default(''),
  sortBy: sortBySchema.default('createdAt'),
  sortOrder: sortOrderSchema.default('desc'),
})

export const findAccessoryByIdSchema = z.object({
  accessoryId: z.uuidv7(),
})

export const findAccessoriesFromTotalWarehouseSchema = z.object({
  totalWarehouseId: z.uuidv7(),
})

export const findAccessoriesFromAscCenterSchema = z.object({
  ascCenterId: z.uuidv7(),
})

export const findAccessoryStockByTotalWarehouseSchema = z.object({
  totalWarehouseId: z.uuidv7(),
  accessoryId: z.uuidv7(),
})

export const findAccessoryStockByAscCenterSchema = z.object({
  ascCenterId: z.uuidv7(),
  accessoryId: z.uuidv7(),
})

export const createTotalWarehouseStockSchema = z.object({
  accessoryId: z.uuidv7(),
  currentStock: stockLevelSchema,
  reservedStock: stockLevelSchema.default(0),
  minStockLevel: stockLevelSchema.default(10),
  maxStockLevel: stockLevelSchema.default(1000),
  location: z.string().trim().max(255).optional().nullable(),
})

export const replaceTotalWarehouseStockSchema = z.object({
  currentStock: stockLevelSchema,
  reservedStock: stockLevelSchema,
  minStockLevel: stockLevelSchema,
  maxStockLevel: stockLevelSchema,
  location: z.string().trim().max(255).optional().nullable(),
})

export const updateTotalWarehouseStockSchema = replaceTotalWarehouseStockSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided for update',
  })

export const createAscAccessoryStockSchema = z.object({
  accessoryId: z.uuidv7(),
  currentStock: stockLevelSchema,
  reservedStock: stockLevelSchema.default(0),
  minStockLevel: stockLevelSchema.default(5),
  maxStockLevel: stockLevelSchema.default(100),
})

export const replaceAscAccessoryStockSchema = z.object({
  currentStock: stockLevelSchema,
  reservedStock: stockLevelSchema,
  minStockLevel: stockLevelSchema,
  maxStockLevel: stockLevelSchema,
})

export const updateAscAccessoryStockSchema = replaceAscAccessoryStockSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: 'At least one field must be provided for update',
  },
)
