import type { BasePagination } from "@/types/pagination";
import type {
  FindAllPaymentsInput,
  FindAllPaymentPeriodsInput,
} from "../dtos/payment.dto";
import type { PaymentListItem, PaymentPeriodListItem } from "../payment.types";

export interface IPaymentService {
  findAllPayments(
    input: FindAllPaymentsInput,
  ): Promise<{ items: PaymentListItem[] | null; pagination: BasePagination }>;
  findAllPaymentPeriods(
    input: FindAllPaymentPeriodsInput,
  ): Promise<{ items: PaymentPeriodListItem[] | null; pagination: BasePagination }>;
  markPaid(
    paymentId: string,
    paymentPeriodId: string,
    userId: string,
  ): Promise<unknown>;
}
