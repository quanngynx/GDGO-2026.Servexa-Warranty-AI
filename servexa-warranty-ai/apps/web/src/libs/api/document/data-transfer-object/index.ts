import type { BasePagination } from '@/libs/api/bases/base-model'

export type RequestListDocumentsDto = {
  page?: number
  limit?: number
  search?: string
  documentType?: string
  ascCenterId?: string
}

export type ResponseDocumentDto = {
  id: string
  title: string
  documentType: string
  version: number
  ascCenterId: string | null
  createdAt: string
  updatedAt: string
}

export type ResponseDocumentListDto = {
  items: ResponseDocumentDto[]
  pagination: BasePagination
}

export type DocumentApiResponse<T> = {
  message: string
  status: number
  metadata: T
}
