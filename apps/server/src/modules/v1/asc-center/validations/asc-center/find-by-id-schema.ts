import z from 'zod'

export const findAscCenterByIdSchema = z.object({
  ascCenterId: z.uuidv7('Invalid ASC center ID'),
})
