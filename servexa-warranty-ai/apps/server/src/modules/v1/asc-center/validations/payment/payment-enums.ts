import { z } from 'zod';
import { PaymentStatus, WarrantyForm } from '@servexa-warranty-ai/db/prisma/client';

export const paymentStatusSchema = z.enum(PaymentStatus);
export const warrantyFormSchema = z.enum(WarrantyForm);
