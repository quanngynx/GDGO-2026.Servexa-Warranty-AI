import type { RequestListDocumentsDto } from '@/libs/api/document/data-transfer-object'

export const documentQueryKeys = {
  all: ['documents'] as const,
  lists: () => [...documentQueryKeys.all, 'list'] as const,
  list: (params?: RequestListDocumentsDto) => [...documentQueryKeys.lists(), params] as const,
  details: () => [...documentQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentQueryKeys.details(), id] as const,
}
