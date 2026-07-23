import type { BasePagination } from '@/libs/api/bases/base-model'

export type RequestListErrorPhenomenonsDto = {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'name'
  sortOrder?: 'asc' | 'desc'
  status?: string
}

export type RequestCreateErrorPhenomenonDto = {
  name: string
  description?: string
  categoryId?: string
  status: string
}

export type RequestUpdateErrorPhenomenonDto = Partial<RequestCreateErrorPhenomenonDto>

export type ResponseErrorPhenomenonDto = RequestCreateErrorPhenomenonDto & {
  id: string
  createdAt: string
  updatedAt: string
}

export type ResponseErrorPhenomenonListDto = {
  items: ResponseErrorPhenomenonDto[]
  pagination: BasePagination
}

export type ErrorPhenomenonApiResponse<T> = {
  message: string
  status: number
  metadata: T
}

