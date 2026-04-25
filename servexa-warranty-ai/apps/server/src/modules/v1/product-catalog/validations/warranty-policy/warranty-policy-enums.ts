import { z } from 'zod';

export const warrantyTypeSchema = z.enum(['standard', 'extended', 'premium']);
export const warrantyPolicyStatusSchema = z.enum(['active', 'inactive']);
