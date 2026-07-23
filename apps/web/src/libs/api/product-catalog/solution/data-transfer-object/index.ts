import type { BasePagination } from '@/libs/api/bases/base-model'

export type RequestListSolutionsDto = {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'name'
  sortOrder?: 'asc' | 'desc'
  status?: string
}

export type RequestCreateSolutionDto = {
  name: string
  description?: string
  instructions: string
  estimatedTime?: number
  difficulty: string
  requiredTools?: string
  requiredParts?: string
  status: string
}

export type RequestUpdateSolutionDto = Partial<RequestCreateSolutionDto>

export type ResponseSolutionDto = RequestCreateSolutionDto & {
  id: string
  createdAt: string
  updatedAt: string
}

export type ResponseSolutionListDto = {
  items: ResponseSolutionDto[]
  pagination: BasePagination
}

export type SolutionApiResponse<T> = {
  message: string
  status: number
  metadata: T
}

