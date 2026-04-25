import { z } from 'zod';
import { warrantyTypeSchema, warrantyPolicyStatusSchema } from './warranty-policy-enums';

export const findAllWarrantyPoliciesSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional().default(''),
  sortBy: z.enum(['createdAt', 'updatedAt', 'effectiveFrom', 'warrantyDurationMonths']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: warrantyPolicyStatusSchema.optional(),
  warrantyType: warrantyTypeSchema.optional(),
  categoryId: z.uuidv7().optional(),
  modelId: z.uuidv7().optional(),
  target: z.enum(['category', 'model']).optional(),
  effectiveOn: z.coerce.date().optional(),
});
