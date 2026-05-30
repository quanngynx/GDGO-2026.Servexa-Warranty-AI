import { z } from 'zod/v4';
import { requestAuthLoginSchema } from '../validations';
import { responseAuthLoginSchema } from '../validations';

export type RequestAuthLoginDto = z.infer<typeof requestAuthLoginSchema>;
export type ResponseAuthLoginDto = z.infer<typeof responseAuthLoginSchema>;
