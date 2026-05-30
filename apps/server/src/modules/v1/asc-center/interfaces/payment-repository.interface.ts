import type { FindAllPaymentsInput, FindAllPaymentPeriodsInput } from '../dtos/payment.dto';
import type { PaymentListItem, PaymentPeriodListItem } from '../payment.types';

export interface IPaymentRepository {
  findManyPayments(input: FindAllPaymentsInput): Promise<PaymentListItem[]>;
  countPayments(input: FindAllPaymentsInput): Promise<number>;
  findManyPeriods(input: FindAllPaymentPeriodsInput): Promise<PaymentPeriodListItem[]>;
  countPeriods(input: FindAllPaymentPeriodsInput): Promise<number>;
  markPaidWithPeriod(args: {
    paymentId: string;
    paymentPeriodId: string;
    userId: string;
  }): Promise<PaymentListItem>;
}
