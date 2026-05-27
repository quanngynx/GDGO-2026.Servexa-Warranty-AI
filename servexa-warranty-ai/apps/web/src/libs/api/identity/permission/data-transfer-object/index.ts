import type { BasePagination } from '@/libs/api/bases/base-model'

export type RequestListPermissionsDto = {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'createdAt' | 'name'
  sortOrder?: 'asc' | 'desc'
}

export type RequestCreatePermissionDto = {
  name: string
  description?: string
}

export type RequestUpdatePermissionDto = {
  name?: string
  description?: string | null
}

export type ResponsePermissionDto = {
  id: string
  name: string
  description: string | null
  createdAt: string
}

export type ResponsePermissionListDto = {
  items: ResponsePermissionDto[]
  pagination: BasePagination
}

export type PermissionApiResponse<T> = {
  message: string
  status: number
  metadata: T
}
