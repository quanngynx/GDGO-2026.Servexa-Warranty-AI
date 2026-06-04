import {
  type AccessoryRequest,
  type AccessoryRequestItem,
  Prisma,
} from "@/core/infra/prisma/generated/client";

export const accessoryRequestSelect = {
  id: true,
  requestNumber: true,
  ascCenterId: true,
  repairCaseId: true,
  requestedBy: true,
  requestDate: true,
  urgency: true,
  justification: true,
  status: true,
  statusRecall: true,
  approvedBy: true,
  approvedDate: true,
  rejectionReason: true,
  totalEstimatedCost: true,
  createdAt: true,
  updatedAt: true,
  ascCenter: { select: { id: true, centerName: true, centerCode: true } },
  requester: { select: { id: true, fullName: true, companyEmail: true } },
  approver: { select: { id: true, fullName: true, companyEmail: true } },
} satisfies Prisma.AccessoryRequestSelect;

export const accessoryRequestDetailInclude = {
  items: {
    include: {
      accessory: {
        select: { id: true, name: true, partNumber: true, unitPrice: true },
      },
    },
  },
  ascCenter: { select: { id: true, centerName: true, centerCode: true } },
  requester: { select: { id: true, fullName: true, companyEmail: true } },
  approver: { select: { id: true, fullName: true, companyEmail: true } },
} satisfies Prisma.AccessoryRequestInclude;

export type AccessoryRequestListItem = Prisma.AccessoryRequestGetPayload<{
  select: typeof accessoryRequestSelect;
}>;

export type AccessoryRequestDetail = Prisma.AccessoryRequestGetPayload<{
  include: typeof accessoryRequestDetailInclude;
}>;

export type AccessoryRequestHeader = AccessoryRequest;

export type { AccessoryRequestItem };
