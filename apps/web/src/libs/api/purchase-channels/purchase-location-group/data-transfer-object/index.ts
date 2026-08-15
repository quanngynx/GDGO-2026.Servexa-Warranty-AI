import type { BasePagination } from '@/libs/api/bases/base-model'

export type RequestListPurchaseLocationGroupsDto = {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  isActive?: boolean
}

export type RequestCreatePurchaseLocationGroupDto = {
  name: string
  code: string
  description?: string
  sortOrder?: number
  isActive?: boolean
}

export type RequestUpdatePurchaseLocationGroupDto = Partial<RequestCreatePurchaseLocationGroupDto>

export type ResponsePurchaseLocationGroupDto = {
  id: string
  name: string
  code: string
  description: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type ResponsePurchaseLocationGroupListDto = {
  items: ResponsePurchaseLocationGroupDto[]
  pagination: BasePagination
}

export type PurchaseLocationGroupApiResponse<T> = {
  message: string
  status: number
  metadata: T
}
