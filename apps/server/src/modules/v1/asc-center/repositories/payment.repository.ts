import prisma from '@servexa-warranty-ai/db';
import { Prisma } from '@servexa-warranty-ai/db/prisma/client';

import type { IPaymentRepository } from '../interfaces/payment-repository.interface';
import type { FindAllPaymentsInput, FindAllPaymentPeriodsInput } from '../dtos/payment.dto';
import { paymentListSelect, paymentPeriodListSelect } from '../payment.types';

export class PaymentRepository implements IPaymentRepository {
  private buildPaymentsWhere(input: FindAllPaymentsInput): Prisma.PaymentWhereInput {
    return {
      ...(input.ascCenterId ? { ascCenterId: input.ascCenterId } : {}),
      ...(input.status ? { status: input.status } : {}),
      ...(input.paymentPeriodId ? { paymentPeriodId: input.paymentPeriodId } : {}),
      ...(input.repairCaseId ? { repairCaseId: input.repairCaseId } : {}),
      ...(input.warrantyForm ? { warrantyForm: input.warrantyForm } : {}),
      ...(input.createdAtFrom || input.createdAtTo
        ? {
            createdAt: {
              ...(input.createdAtFrom ? { gte: new Date(input.createdAtFrom) } : {}),
              ...(input.createdAtTo ? { lte: new Date(input.createdAtTo) } : {}),
            },
          }
        : {}),
      ...(input.search
        ? {
            OR: [
              { caseNumber: { contains: input.search, mode: 'insensitive' } },
              { paymentNumber: { contains: input.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
  }

  async findManyPayments(input: FindAllPaymentsInput) {
    const skip = (input.page - 1) * input.limit;
    return prisma.payment.findMany({
      where: this.buildPaymentsWhere(input),
      select: paymentListSelect,
      orderBy: { [input.sortBy]: input.sortOrder },
      skip,
      take: input.limit,
    });
  }

  async countPayments(input: FindAllPaymentsInput) {
    return prisma.payment.count({
      where: this.buildPaymentsWhere(input),
    });
  }

  private buildPeriodsWhere(input: FindAllPaymentPeriodsInput): Prisma.PaymentPeriodWhereInput {
    return {
      ...(input.search ? { name: { contains: input.search, mode: 'insensitive' } } : {}),
      ...(input.startDateFrom || input.startDateTo
        ? {
            startDate: {
              ...(input.startDateFrom ? { gte: new Date(input.startDateFrom) } : {}),
              ...(input.startDateTo ? { lte: new Date(input.startDateTo) } : {}),
            },
          }
        : {}),
      ...(input.endDateFrom || input.endDateTo
        ? {
            endDate: {
              ...(input.endDateFrom ? { gte: new Date(input.endDateFrom) } : {}),
              ...(input.endDateTo ? { lte: new Date(input.endDateTo) } : {}),
            },
          }
        : {}),
    };
  }

  async findManyPeriods(input: FindAllPaymentPeriodsInput) {
    const skip = (input.page - 1) * input.limit;
    return prisma.paymentPeriod.findMany({
      where: this.buildPeriodsWhere(input),
      select: paymentPeriodListSelect,
      orderBy: { [input.sortBy]: input.sortOrder },
      skip,
      take: input.limit,
    });
  }

  async countPeriods(input: FindAllPaymentPeriodsInput) {
    return prisma.paymentPeriod.count({
      where: this.buildPeriodsWhere(input),
    });
  }

  async markPaidWithPeriod(args: { paymentId: string; paymentPeriodId: string; userId: string }) {
    return prisma.$transaction(async (tx) => {
      // 1. Verify payment
      const payment = await tx.payment.findUnique({
        where: { id: args.paymentId },
        select: { id: true, status: true },
      });
      if (!payment) {
        throw new Error('NOT_FOUND: Payment not found');
      }
      if (payment.status === 'paid' || payment.status === 'cancelled') {
        throw new Error('BAD_REQUEST: Cannot mark this payment as paid');
      }

      // 2. Verify period
      const period = await tx.paymentPeriod.findUnique({
        where: { id: args.paymentPeriodId },
        select: { id: true },
      });
      if (!period) {
        throw new Error('NOT_FOUND: PaymentPeriod not found');
      }

      // 3. Generate paymentNumber
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const paymentNumber = `PM${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}`;

      // 4. Update
      return tx.payment.update({
        where: { id: args.paymentId },
        data: {
          status: 'paid',
          paymentNumber,
          changedBy: args.userId,
          changedAt: d,
          paymentPeriod: { connect: { id: args.paymentPeriodId } },
        },
        select: paymentListSelect,
      });
    });
  }
}
