import z from 'zod/v4';

export const findChildrenRolesSchema = z.strictObject({
  roleId: z.uuidv7('Not match id format'),
});
