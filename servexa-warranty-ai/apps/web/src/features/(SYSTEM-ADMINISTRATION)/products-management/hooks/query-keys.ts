import type { RequestListModelsDto } from '@/libs/api/product-catalog/model/data-transfer-object'

export const modelQueryKeys = {
  all: ['models'] as const,
  lists: () => [...modelQueryKeys.all, 'list'] as const,
  list: (params?: RequestListModelsDto) => [...modelQueryKeys.lists(), params] as const,
  details: () => [...modelQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...modelQueryKeys.details(), id] as const,
}
