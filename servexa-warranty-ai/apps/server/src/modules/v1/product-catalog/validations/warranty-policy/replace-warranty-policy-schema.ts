import { z } from 'zod';
import { warrantyTypeSchema, warrantyPolicyStatusSchema } from './warranty-policy-enums';

const replaceWarrantyPolicyBodySchema = z.object({
  categoryId: z.uuidv7().optional(),
  modelId: z.uuidv7().optional(),
  warrantyType: warrantyTypeSchema,
  warrantyDurationMonths: z.number().int().nonnegative(),
  coverageDescription: z.string().optional().nullable(),
  termsConditions: z.string().optional().nullable(),
  effectiveFrom: z.coerce.date(),
  effectiveTo: z.coerce.date().optional().nullable(),
  status: warrantyPolicyStatusSchema,
});

export const replaceWarrantyPolicySchema = replaceWarrantyPolicyBodySchema.superRefine((data, ctx) => {
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
  if (data.effectiveTo && data.effectiveTo < data.effectiveFrom) {
    ctx.addIssue({
      code: 'custom',
      message: 'effectiveTo must be greater than or equal to effectiveFrom',
      path: ['effectiveTo'],
    });
  }
});

export const updateWarrantyPolicySchema = replaceWarrantyPolicyBodySchema.partial().superRefine((data, ctx) => {
  if (data.categoryId !== undefined && data.modelId !== undefined) {
    if (data.categoryId && data.modelId) {
      ctx.addIssue({
        code: 'custom',
        message: 'Exactly one of categoryId or modelId must be provided',
        path: ['categoryId'],
      });
    }
  }
  if (data.effectiveFrom && data.effectiveTo && data.effectiveTo < data.effectiveFrom) {
    ctx.addIssue({
      code: 'custom',
      message: 'effectiveTo must be greater than or equal to effectiveFrom',
      path: ['effectiveTo'],
    });
  }
});
