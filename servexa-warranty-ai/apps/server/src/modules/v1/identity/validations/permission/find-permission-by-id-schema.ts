import z from 'zod'

export const findPermissionByIdSchema = z.object({
  permissionId: z.uuidv7(),
})
