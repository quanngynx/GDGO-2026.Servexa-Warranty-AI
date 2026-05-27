import type { FindAllPaymentsInput, FindAllPaymentPeriodsInput } from '../dtos/payment.dto';
import type { Payment, PaymentPeriod, Prisma } from "@servexa-warranty-ai/db/prisma/client";

export interface IPaymentRepository {
  findManyPayments(input: FindAllPaymentsInput): Promise<(Payment & Prisma.PaymentInclude)[] | null>;
  countPayments(input: FindAllPaymentsInput): Promise<number>;
  findManyPeriods(input: FindAllPaymentPeriodsInput): Promise<(PaymentPeriod & Prisma.PaymentPeriodInclude)[] | null>;
  countPeriods(input: FindAllPaymentPeriodsInput): Promise<number>;
  markPaidWithPeriod(args: { paymentId: string; paymentPeriodId: string; userId: string }): Promise<unknown>;
}
