import z from 'zod/v4';

export const roleCreationSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  parentRoleId: z.uuidv7('Not match id format').optional(),
});
