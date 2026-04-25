import { z } from 'zod';

export const findWarrantyPolicyByIdSchema = z.object({
  warrantyPolicyId: z.uuidv7(),
});
