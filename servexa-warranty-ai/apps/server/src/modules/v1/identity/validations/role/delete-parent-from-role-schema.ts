import z from 'zod/v4';

export const deleteParentFromRoleSchema = z.strictObject({
  roleId: z.uuidv7('Not match id format'),
  parentRoleId: z.uuidv7('Not match id format'),
});
