import { z } from 'zod';
import { warrantyTypeSchema, warrantyPolicyStatusSchema } from './warranty-policy-enums';

export const createWarrantyPolicySchema = z.object({
  categoryId: z.uuidv7().optional(),
  modelId: z.uuidv7().optional(),
  warrantyType: warrantyTypeSchema,
  warrantyDurationMonths: z.number().int().nonnegative(),
  coverageDescription: z.string().optional(),
  termsConditions: z.string().optional(),
  effectiveFrom: z.coerce.date(),
  effectiveTo: z.coerce.date().optional(),
  status: warrantyPolicyStatusSchema.default('active'),
}).superRefine((data, ctx) => {
  // Exactly one of categoryId/modelId
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

  // effectiveTo >= effectiveFrom
  if (data.effectiveTo && data.effectiveTo < data.effectiveFrom) {
    ctx.addIssue({
      code: 'custom',
      message: 'effectiveTo must be greater than or equal to effectiveFrom',
      path: ['effectiveTo'],
    });
  }
});
