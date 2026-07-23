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

export type ResponseExportJobDto = {
  id: string
  requestedBy: string
  tenantId: string | null
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'expired'
  format: string
  filters: Record<string, unknown> | null
  columns: string[]
  sort: Record<string, unknown> | null
  snapshotAt: string
  idempotencyKey: string | null
  lastCursorId: string | null
  estimatedRows: number | null
  processedRows: number
  rowCount: number | null
  progressPercent: number | null
  fileName: string | null
  storageKey: string | null
  fileSize: number | string | null
  checksum: string | null
  contentType: string | null
  attemptCount: number
  maxAttempts: number
  errorCode: string | null
  errorMessage: string | null
  cancellationAt: string | null
  startedAt: string | null
  completedAt: string | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string
}
