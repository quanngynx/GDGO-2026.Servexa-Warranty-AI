import { z } from 'zod';
import { warrantyTypeSchema } from './warranty-policy-enums';

export const resolveWarrantyPolicySchema = z.object({
  categoryId: z.uuidv7().optional(),
  modelId: z.uuidv7().optional(),
  warrantyType: warrantyTypeSchema,
  date: z.coerce.date().optional(),
}).superRefine((data, ctx) => {
  if ((data.categoryId && data.modelId) || (!data.categoryId && !data.modelId)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Exactly one of categoryId or modelId must be provided',
      path: ['categoryId'],
    });
    ctx.addIssue({
      code: 'custom',
      message: 'Exactly one of categoryId or modelId must be provided',
      path: ['modelId'],
    });
  }
});
