import type { BasePagination } from '@/libs/api/bases/base-model'

export type RequestListTotalWarehousesDto = {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'name'
  sortOrder?: 'asc' | 'desc'
  status?: 'active' | 'inactive'
}

export type RequestCreateTotalWarehouseDto = {
  name: string
  address?: string
  status?: 'active' | 'inactive'
}

export type RequestUpdateTotalWarehouseDto = Partial<RequestCreateTotalWarehouseDto>

export type ResponseTotalWarehouseDto = {
  id: string
  name: string
  address: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export type ResponseTotalWarehouseListDto = {
  items: ResponseTotalWarehouseDto[]
  pagination: BasePagination
}

export type TotalWarehouseApiResponse<T> = {
  message: string
  status: number
  metadata: T
}
