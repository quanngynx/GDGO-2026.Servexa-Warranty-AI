import { Prisma } from "@/core/infra/prisma/generated/client";

export const repairCaseListSelect = {
  id: true,
  caseNumber: true,
  ascCenterId: true,
  customerId: true,
  status: true,
  priority: true,
  warrantyForm: true,
  warrantyServiceType: true,
  statusRecall: true,
  serialNumber: true,
  serviceFee: true,
  laborCost: true,
  partsCost: true,
  shippingCost: true,
  shippingProvinceId: true,
  shippingWardId: true,
  distanceFee: true,
  totalCost: true,
  errorGroup: true,
  errorSource: true,
  repairLevel: true,
  purchaseDate: true,
  purchaseLocation: true,
  purchaseOrderNumber: true,
  householdProductType: true,
  csRtStatus: { select: { csStatus: true, rtStatus: true } },
  exchangeProduct: true,
  invoiceCode: true,
  waitAccessoryItems: {
    select: { repairCaseId: true, partName: true, quantity: true },
  },
  errorAccessoryItems: {
    select: { repairCaseId: true, partName: true, quantity: true },
  },
  paymentDetail: { select: { paymentPendingStatus: true } },
  receivedDate: true,
  promisedDeliveryDate: true,
  actualCompletionDate: true,
  finalCompletionDate: true,
  createdAt: true,
  updatedAt: true,
  ascCenter: { select: { centerName: true, centerCode: true } },
  customer: {
    select: { fullName: true, phone1: true, email: true, address: true },
  },
  model: {
    select: {
      name: true,
      modelCode: true,
      laborCost: true,
      inspectionCost: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  purchaseLocationDetails: {
    select: {
      name: true,
      code: true,
      group: {
        select: { name: true, code: true },
      },
    },
  },
  shippingProvince: { select: { name: true, code: true } },
  shippingWard: { select: { name: true, code: true } },
  creator: { select: { username: true, fullName: true } },
  errorPhenomena: {
    select: {
      errorPhenomenon: {
        select: {
          name: true,
          categoryId: true,
        },
      },
    },
  },
  reasons: {
    select: {
      reason: {
        select: {
          name: true,
          errorPhenomenonId: true,
        },
      },
    },
  },
  accessories: {
    select: {
      quantity: true,
      unitPrice: true,
      totalPrice: true,
      addedAt: true,
      accessory: {
        select: {
          name: true,
          partNumber: true,
          itemNumber: true,
          description: true,
        },
      },
    },
  },
  assignedEmployee: { select: { fullName: true, employeeCode: true } },
  technicianName: true,
  areaId: true,
} satisfies Prisma.RepairCaseSelect;

export const repairCaseDetailSelect = {
  ...repairCaseListSelect,
  solutionId: true,
  damageDescription: true,
  diagnosis: true,
  repairSolution: true,
  repairNotes: true,
  discountAmount: true,
  otherFee: true,
  otherFeeNote: true,
  estimatedCompletionDate: true,
  paymentDate: true,
  paymentMethod: true,
  paymentReference: true,
  paymentNotes: true,
  deliveryNotes: true,
  ascPaymentAmount: true,
  companyDeduction: true,
  taxAmount: true,
  processingFee: true,
  netPayment: true,
  assignedEmployeeId: true,
  assignedTechnicianId: true,
  createdBy: true,
  approvedBy: true,
  receiverName: true,
  receiverPhone: true,
  foodSafetyCompliance: true,
  sealIntegrityStatus: true,
  plasticDurabilityLevel: true,
  estimatedStartDate: true,
  estimatedCost: true,
  actualRepairTime: true,
  estimatedRepairTime: true,
  distanceFeeCalculatedAt: true,
  distanceFeeCalculatedBy: true,
  serviceDistance: true,
  warrantyResolution: true,
  repairActivity: true,
  solution: true,
  _count: {
    select: {
      accessories: true,
      images: true,
      statusHistory: true,
      fieldHistory: true,
      accessoryRequest: true,
    },
  },
} satisfies Prisma.RepairCaseSelect;

export type RepairCaseListItem = Prisma.RepairCaseGetPayload<{
  select: typeof repairCaseListSelect;
}>;

export type RepairCaseDetail = Prisma.RepairCaseGetPayload<{
  select: typeof repairCaseDetailSelect;
}>;
