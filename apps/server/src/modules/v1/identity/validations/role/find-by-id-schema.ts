import z from 'zod/v4';

export const findByIdSchema = z.strictObject({
  roleId: z.uuid('Invalid UUID format'),
});
