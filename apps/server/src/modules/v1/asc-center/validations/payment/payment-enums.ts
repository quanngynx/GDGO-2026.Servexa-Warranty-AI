import { z } from 'zod';
import { PaymentStatus, WarrantyForm } from '@/core/infra/prisma/generated/client';

export const paymentStatusSchema = z.enum(PaymentStatus);
export const warrantyFormSchema = z.enum(WarrantyForm);
