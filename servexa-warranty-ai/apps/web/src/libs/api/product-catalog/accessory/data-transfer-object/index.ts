import type { BasePagination } from '@/libs/api/bases/base-model'

export type RequestListAccessoriesDto = {
  page?: number
  limit?: number
  search?: string
  status?: 'active' | 'inactive'
}

export type ResponseAccessoryDto = {
  id: string
  name: string
  partNumber: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export type ResponseAccessoryListDto = {
  items: ResponseAccessoryDto[]
  pagination: BasePagination
}

export type AccessoryApiResponse<T> = {
  message: string
  status: number
  metadata: T
}
