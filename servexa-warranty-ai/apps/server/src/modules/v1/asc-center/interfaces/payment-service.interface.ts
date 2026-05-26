import type { BasePagination } from "@/types/pagination";
import type {
  FindAllPaymentsInput,
  FindAllPaymentPeriodsInput,
} from "../dtos/payment.dto";
import type { Payment, PaymentPeriod, Prisma } from "@servexa-warranty-ai/db/prisma/client";

export interface IPaymentService {
  findAllPayments(
    input: FindAllPaymentsInput,
  ): Promise<{ items: (Payment & Prisma.PaymentInclude)[] | null, pagination: BasePagination }>;
  findAllPaymentPeriods(
    input: FindAllPaymentPeriodsInput,
  ): Promise<{ items: (PaymentPeriod & Prisma.PaymentPeriodInclude)[] | null, pagination: BasePagination }>;
  markPaid(
    paymentId: string,
    paymentPeriodId: string,
    userId: string,
  ): Promise<unknown>;
}
