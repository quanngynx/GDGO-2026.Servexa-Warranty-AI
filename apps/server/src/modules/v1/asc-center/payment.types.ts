import type { Prisma } from '@servexa-warranty-ai/db/prisma/client';

export const paymentListSelect = {
  id: true,
  paymentNumber: true,
  caseNumber: true,
  status: true,
  totalCost: true,
  laborOrInspection: true,
  shippingCost: true,
  distanceFee: true,
  warrantyForm: true,
  paymentPeriodId: true,
  repairCaseId: true,
  ascCenterId: true,
  changedBy: true,
  changedAt: true,
  createdAt: true,
  updatedAt: true,
  ascCenter: { select: { id: true, centerName: true, centerCode: true } },
  paymentPeriod: { select: { id: true, name: true, startDate: true, endDate: true } },
  repairCase: { select: { id: true, caseNumber: true, status: true } },
} satisfies Prisma.PaymentSelect;

export const paymentPeriodListSelect = {
  id: true,
  name: true,
  startDate: true,
  endDate: true,
  _count: { select: { payments: true } },
} satisfies Prisma.PaymentPeriodSelect;

export type PaymentListItem = Prisma.PaymentGetPayload<{ select: typeof paymentListSelect }>;

export type PaymentPeriodListItem = Prisma.PaymentPeriodGetPayload<{
  select: typeof paymentPeriodListSelect;
}>;
