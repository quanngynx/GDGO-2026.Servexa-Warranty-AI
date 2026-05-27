import type { BasePagination } from "@/libs/api/bases/base-model";
import type { BaseApiResponse } from "@/libs/api/bases/base-response";

export type ListCustomersParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "fullName" | "phone1";
  sortOrder?: "asc" | "desc";
  customerGroup?: string;
  ascCenterId?: string;
};

export type CustomerResponseDto = {
  id: string;
  customerGroup: string;
  fullName: string;
  phone1: string;
  phone2: string;
  email: string;
  provinceId: string | null;
  wardId: string | null;
  address: string | null;
  taxCode: string | null;
  bankName: string | null;
  accountNumber: string | null;
  contactPerson: string | null;
  ascCenterId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CustomerListResponse = {
  items: CustomerResponseDto[];
  pagination: BasePagination;
};

export type CustomerListApiResponse = BaseApiResponse<CustomerListResponse>;
