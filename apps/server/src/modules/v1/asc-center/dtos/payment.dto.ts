import { z } from 'zod';
import {
  findAllPaymentsSchema,
  findAllPaymentPeriodsSchema,
  markPaidParamsSchema,
} from '../validations/payment';

export type FindAllPaymentsInput = z.infer<typeof findAllPaymentsSchema>;
export type FindAllPaymentPeriodsInput = z.infer<typeof findAllPaymentPeriodsSchema>;
export type MarkPaidParams = z.infer<typeof markPaidParamsSchema>;
