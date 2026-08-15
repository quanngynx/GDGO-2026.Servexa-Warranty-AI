import type { RequestListSolutionsDto } from '@/libs/api/product-catalog/solution/data-transfer-object'

export const solutionQueryKeys = {
  all: ['solutions'] as const,
  lists: () => [...solutionQueryKeys.all, 'list'] as const,
  list: (params?: RequestListSolutionsDto) => [...solutionQueryKeys.lists(), params] as const,
  details: () => [...solutionQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...solutionQueryKeys.details(), id] as const,
}
