import type { BasePagination } from "@/libs/api/bases/base-model";
import type { BaseApiResponse } from "@/libs/api/bases/base-response";

export type RepairCaseStatus =
  | "tiepnhan"
  | "dangsua"
  | "chocaplk"
  | "choykienkhach"
  | "choykiencongty"
  | "khachkhongsua"
  | "khongsuaduoc"
  | "exchange_completed_asc"
  | "cs_supported_asc"
  | "suaxong"
  | "dagiao"
  | "hoanthanh"
  | "huyphieu";

export type RepairCasePriority = "low" | "normal" | "high" | "urgent";

export type RequestListRepairCasesDto = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "receivedDate" | "caseNumber" | "status";
  sortOrder?: "asc" | "desc";
  status?: RepairCaseStatus;
  ascCenterId?: string;
  customerId?: string;
  modelId?: string;
  priority?: RepairCasePriority;
};

export type WarrantyForm = "in_warranty" | "out_of_warranty";

export type RepairWarrantyServiceType = "at_asc" | "on_site";

export type RequestCreateRepairCaseDto = {
  ascCenterId: string;
  customerId: string;
  damageDescription: string;
  receivedDate: string;
  modelId?: string | null;
  status?: RepairCaseStatus;
  priority?: RepairCasePriority;
};

export type RequestUpdateRepairCaseDto = Partial<RequestCreateRepairCaseDto>;

export type RepairCaseImageType =
  | "model_serial"
  | "repair_form"
  | "before_repair"
  | "after_repair"
  | "parts_components"
  | "warranty_invoice"
  | "shipping_fee_invoice"
  | "repair_completion_receipt";

export type RepairCaseImageDto = {
  id: string;
  repairCaseId: string;
  imageType: RepairCaseImageType;
  imagePath: string;
  originalFilename: string;
  fileSize: number;
  mimeType: string;
  description?: string | null;
  uploadedAt: string;
};

// ===============================================
// API Request Data Transfer Object
// ===============================================
//
// ===============================================

// ===============================================
// API Response Data Transfer Object
// ===============================================
//
// ===============================================
export interface RepairCaseDto {
  id: string;
  caseNumber: string;
  ascCenterId: string;
  customerId: string;
  status: RepairCaseStatus;
  priority: RepairCasePriority;
  warrantyForm: WarrantyForm;
  warrantyServiceType: RepairWarrantyServiceType;
  statusRecall: string | null;
  serialNumber: string;
  serviceFee: number;
  laborCost: number;
  partsCost: number;
  shippingCost: number;
  shippingProvinceId: string | null;
  shippingWardId: string | null;
  distanceFee: number | null;
  totalCost: number;
  errorGroup: string | null;
  errorSource: string | null;
  repairLevel: string | null;
  purchaseDate: Date;
  purchaseLocation: string | null;
  purchaseOrderNumber: null;
  householdProductType: null;
  csRtStatus: { csStatus: string; rtStatus: string; } | null;
  exchangeProduct: null;
  invoiceCode: null;
  waitAccessoryItems: { repairCaseId: string; partName: string; quantity: number }[];
  errorAccessoryItems: { repairCaseId: string; partName: string; quantity: number }[];
  paymentDetail: { paymentPendingStatus: string } | null;
  receivedDate: Date;
  promisedDeliveryDate: Date;
  actualCompletionDate: Date | null;
  finalCompletionDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  ascCenter: {
    centerName: string;
    centerCode: string;
  };
  customer: {
    fullName: string;
    phone1: string;
    email: string;
    address: string;
  };
  model: {
    name: string;
    modelCode: string;
    laborCost: number | null;
    inspectionCost: number | null;
    category: {
      id: string;
      name: string;
    };
  };
  purchaseLocationDetails: { name: string; code: string; group: { name: string; code: string } } | null;
  shippingProvince: { name: string; code: string } | null;
  shippingWard: { name: string; code: string } | null;
  creator: {
    username: string;
    fullName: string;
  };
  errorPhenomena: {
    errorPhenomenon: {
      name: string;
      categoryId: string;
    };
  }[];
  reasons: { reason: { name: string; errorPhenomenonId: string } }[];
  accessories: { quantity: number, unitPrice: number,
      totalPrice: number,
      addedAt: Date,
      accessory: {
          name: string,
          partNumber: string,
          itemNumber: string,
          description: string,
      }
    }[];
  assignedEmployee: {
    fullName: string;
    employeeCode: string;
  };
  technicianName: string | null;
  areaId: string;
}

export interface RepairCaseDetailDto extends RepairCaseDto {
  solutionId: string | null;
  diagnosis: string | null;
  repairSolution: string | null;
  repairNotes: string | null;
  discountAmount: number | null;
  otherFee: number | null;
  otherFeeNote: string | null;
  estimatedCompletionDate: Date | null;
  paymentDate: Date | null;
  paymentMethod: string | null;
  paymentReference: string | null;
  paymentNotes: string | null;
  deliveryNotes: string | null;
  ascPaymentAmount: number | null;
  companyDeduction: number | null;
  taxAmount: number | null;
  processingFee: number | null;
  netPayment: number | null;
  assignedEmployeeId: string | null;
  assignedTechnicianId: string | null;
  createdBy: string | null;
  approvedBy: string | null;
  receiverName: string | null;
  receiverPhone: string | null;
  foodSafetyCompliance: string | null;
  sealIntegrityStatus: string | null;
  plasticDurabilityLevel: string | null;
  estimatedStartDate: Date | null;
  estimatedCost: number | null;
  actualRepairTime: number | null;
  estimatedRepairTime: number | null;
  distanceFeeCalculatedAt: Date | null;
  distanceFeeCalculatedBy: string | null;
  serviceDistance: number | null;
  warrantyResolution: string | null;
  repairActivity: string | null;
}

export type ResponseRepairCaseListDto = BaseApiResponse<{
  items: RepairCaseDto[];
  pagination: BasePagination;
}>;
export type ResponseRepairCaseDetailDto = BaseApiResponse<RepairCaseDetailDto>;