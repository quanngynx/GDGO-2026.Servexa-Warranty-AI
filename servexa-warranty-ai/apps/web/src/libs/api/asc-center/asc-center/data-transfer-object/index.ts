import type { BasePagination } from '@/libs/api/bases/base-model'

export type RequestListAscCentersDto = {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'centerName'
  sortOrder?: 'asc' | 'desc'
  status?: 'active' | 'inactive' | 'suspended'
}

export type RequestCreateAscCenterDto = {
  centerName: string
  centerCode: string
  companyName?: string
  region?: string
  email?: string
  address?: string
  phone?: string
  status?: string
}

export type RequestUpdateAscCenterDto = Partial<RequestCreateAscCenterDto>

export type ResponseAscCenterDto = {
  id: string
  centerName: string
  centerCode: string
  companyName: string | null
  region: string | null
  email: string | null
  address: string | null
  phone: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export type ResponseAscCenterListDto = {
  items: ResponseAscCenterDto[]
  pagination: BasePagination
}

export type AscCenterApiResponse<T> = {
  message: string
  status: number
  metadata: T
}
