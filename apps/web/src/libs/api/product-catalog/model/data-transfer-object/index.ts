import type { BasePagination } from '@/libs/api/bases/base-model'

export type RequestListModelsDto = {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'modelCode'
  sortOrder?: 'asc' | 'desc'
  status?: string
  categoryId?: string
}

export type RequestCreateModelDto = {
  categoryId: string
  name: string
  modelCode: string
  status?: string
  stockNumber?: number
  laborCost?: number
  inspectionCost?: number
}

export type RequestUpdateModelDto = Partial<RequestCreateModelDto>

export type ResponseModelDto = {
  id: string
  categoryId: string
  name: string
  modelCode: string
  image: string | null
  status: string
  stockNumber: number | null
  laborCost: string | number | null
  inspectionCost: string | number | null
  createdAt: string
  updatedAt: string
  category?: { id: string; name: string }
}

export type ResponseModelListDto = {
  items: ResponseModelDto[]
  pagination: BasePagination
}

export type ModelApiResponse<T> = {
  message: string
  status: number
  metadata: T
}
