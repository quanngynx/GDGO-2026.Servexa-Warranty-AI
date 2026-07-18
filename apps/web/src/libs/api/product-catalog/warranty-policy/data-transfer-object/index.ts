import type { BasePagination } from '@/libs/api/bases/base-model'

export type RequestListWarrantyPoliciesDto = {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'name'
  sortOrder?: 'asc' | 'desc'
  status?: string
}

export type RequestCreateWarrantyPolicyDto = {
  categoryId?: string
  modelId?: string
  warrantyType: string
  warrantyDurationMonths: number
  coverageDescription?: string
  termsConditions?: string
  effectiveFrom: string
  effectiveTo?: string
  status: string
}

export type RequestUpdateWarrantyPolicyDto = Partial<RequestCreateWarrantyPolicyDto>

export type ResponseWarrantyPolicyDto = RequestCreateWarrantyPolicyDto & {
  id: string
  createdAt: string
  updatedAt: string
}

export type ResponseWarrantyPolicyListDto = {
  items: ResponseWarrantyPolicyDto[]
  pagination: BasePagination
}

export type WarrantyPolicyApiResponse<T> = {
  message: string
  status: number
  metadata: T
}

export type RequestResolveWarrantyPolicyDto = {
  categoryId?: string
  modelId?: string
  warrantyType: string
  date?: string
}
