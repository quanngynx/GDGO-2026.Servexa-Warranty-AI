import type { BasePagination } from '@/libs/api/bases/base-model'

export type RequestListPurchaseLocationsDto = {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  isActive?: boolean
  groupId?: string
}

export type RequestCreatePurchaseLocationDto = {
  groupId: string
  name: string
  code: string
  description?: string
  website?: string
  address?: string
  sortOrder?: number
  isActive?: boolean
}

export type RequestUpdatePurchaseLocationDto = Partial<RequestCreatePurchaseLocationDto>

export type ResponsePurchaseLocationDto = {
  id: string
  groupId: string
  name: string
  code: string
  description: string | null
  website: string | null
  address: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  group?: { id: string; name: string; code: string }
}

export type ResponsePurchaseLocationListDto = {
  items: ResponsePurchaseLocationDto[]
  pagination: BasePagination
}

export type PurchaseLocationApiResponse<T> = {
  message: string
  status: number
  metadata: T
}
