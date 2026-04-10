import z from 'zod';

export const requestAuthLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false)
});

export const responseAuthLoginSchema = z.object({
  user: z.object({
    id: z.string().min(1, 'ID is required'),
    username: z.string().min(1, 'Username is required'),
    fullName: z.string().min(1, 'Full name is required'),
    email: z.email('Email is required'),
    role: z.string().min(1, 'Role is required'),
    permissions: z.array(z.string()).optional(),
  }),
  accessToken: z.string().min(1, 'Access token is required'),
  refreshToken: z.string().min(1, 'Refresh token is required'),
  expiresInAccessToken: z
    .number()
    .min(1, 'Expires in access token is required'),
  expiresInRefreshToken: z
    .number()
    .min(1, 'Expires in refresh token is required'),
});

// Query schema for user profile (optional parameters)
export const profileQuerySchema = z.object({
  includeDetails: z.string().transform(val => val === 'true').optional(),
  fields: z.string().optional() // Could be used to specify which fields to return
});

export const currentUserQuerySchema = z.object({
  id: z.string().min(1, 'Invalid user ID format'),
  email: z.email(),
  username: z.string(),
  fullName: z.string(),
  role: z.string().min(1),
  roleScope: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export * from './user'
