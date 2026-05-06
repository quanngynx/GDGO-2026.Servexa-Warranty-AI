import { z } from 'zod/v4';

export const requestPermissionCheckSchema = z.object({
  permission: z
    .string()
    .min(1, 'Permission is required')
    .regex(
      /^[a-z_]+\.([a-z_]+\.)*[a-z_]+$/,
      'Permission must be in format: resource.action or resource.subresource.action',
    )
    .trim(),
  context: z.record(z.string(), z.any()).optional(),
});

export const responsePermissionCheckSchema = z.object({
  hasPermission: z.boolean(),
  permission: z.string(),
  userId: z.string(),
});
