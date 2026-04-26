import { z } from 'zod';

export const markPaidParamsSchema = z.object({
  id: z.uuidv7(),
  paymentPeriodId: z.uuidv7(),
});
