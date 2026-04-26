import type { FindAllPaymentsInput, FindAllPaymentPeriodsInput } from '../dtos/payment.dto';
import type { Payment, PaymentPeriod } from "@servexa-warranty-ai/db/prisma/client";

export interface IPaymentRepository {
  findManyPayments(input: FindAllPaymentsInput): Promise<Payment[]>;
  countPayments(input: FindAllPaymentsInput): Promise<number>;
  findManyPeriods(input: FindAllPaymentPeriodsInput): Promise<PaymentPeriod[]>;
  countPeriods(input: FindAllPaymentPeriodsInput): Promise<number>;
  markPaidWithPeriod(args: { paymentId: string; paymentPeriodId: string; userId: string }): Promise<unknown>;
}
