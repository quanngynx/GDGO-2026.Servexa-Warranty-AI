import type { BasePagination } from '@/libs/api/bases/base-model'

export type RequestListCategoriesDto = {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'name'
  sortOrder?: 'asc' | 'desc'
  status?: 'active' | 'inactive'
}

export type RequestCreateCategoryDto = {
  name: string
  description?: string
  status?: 'active' | 'inactive'
  laborCost?: number
  inspectionCost?: number
}

export type RequestUpdateCategoryDto = Partial<RequestCreateCategoryDto>

export type ResponseCategoryDto = {
  id: string
  name: string
  description: string | null
  status: string
  laborCost: string | number
  inspectionCost: string | number
  createdAt: string
  updatedAt: string
}

export type ResponseCategoryListDto = {
  items: ResponseCategoryDto[]
  pagination: BasePagination
}

export type CategoryApiResponse<T> = {
  message: string
  status: number
  metadata: T
}
