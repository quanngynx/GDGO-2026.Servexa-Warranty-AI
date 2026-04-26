import { z } from 'zod'

export const findRepairCaseByIdSchema = z.object({
  params: z.object({
    id: z.uuidv7(),
  }),
})

export const findHistoryByIdSchema = z.object({
  params: z.object({
    id: z.uuidv7(),
  }),
})

export const findImageByIdSchema = z.object({
  params: z.object({
    id: z.uuidv7(),
    imageId: z.uuidv7(),
  }),
})

export const findAccessoryRowByIdSchema = z.object({
  params: z.object({
    id: z.uuidv7(),
    accessoryRowId: z.uuidv7(),
  }),
})
