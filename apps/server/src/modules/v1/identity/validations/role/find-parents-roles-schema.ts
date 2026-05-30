import z from 'zod/v4';

export const findParentsRolesSchema = z.strictObject({
  roleId: z.uuidv7('Not match id format'),
});
