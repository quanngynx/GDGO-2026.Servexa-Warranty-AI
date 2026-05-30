import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { createOperationalError } from "@/middlewares/error-middleware";
import { buildPagination } from "@/utils/pagination";

import type { IPaymentService } from "../interfaces/payment-service.interface";
import type { IPaymentRepository } from "../interfaces/payment-repository.interface";
import { PaymentRepository } from "../repositories/payment.repository";
import type {
  FindAllPaymentsInput,
  FindAllPaymentPeriodsInput,
} from "../dtos/payment.dto";

export class PaymentService implements IPaymentService {
  constructor(
    private readonly paymentRepository: IPaymentRepository = new PaymentRepository(),
  ) {}

  async findAllPayments(input: FindAllPaymentsInput) {
    const [items, total] = await Promise.all([
      this.paymentRepository.findManyPayments(input),
      this.paymentRepository.countPayments(input),
    ]);

    return {
      items,
      pagination: buildPagination(input.page, input.limit, total),
    };
  }

  async findAllPaymentPeriods(input: FindAllPaymentPeriodsInput) {
    const [items, total] = await Promise.all([
      this.paymentRepository.findManyPeriods(input),
      this.paymentRepository.countPeriods(input),
    ]);

    return {
      items,
      pagination: buildPagination(input.page, input.limit, total),
    };
  }

  async markPaid(paymentId: string, paymentPeriodId: string, userId: string) {
    try {
      const result = await this.paymentRepository.markPaidWithPeriod({
        paymentId,
        paymentPeriodId,
        userId,
      });
      return result;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      if (msg.includes("NOT_FOUND")) {
        throw createOperationalError(msg, HTTP_RESPONSE_CODE.NOT_FOUND);
      }
      if (msg.includes("BAD_REQUEST")) {
        throw createOperationalError(msg, HTTP_RESPONSE_CODE.BAD_REQUEST);
      }
      throw error;
    }
  }
}
