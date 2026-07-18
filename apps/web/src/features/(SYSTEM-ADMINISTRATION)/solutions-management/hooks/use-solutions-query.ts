import { useQuery } from '@tanstack/react-query'
import { solutionAPI } from '@/libs/api/product-catalog/solution/api'
import type { RequestListSolutionsDto } from '@/libs/api/product-catalog/solution/data-transfer-object'
import { solutionQueryKeys } from './query-keys'

export const useSolutionsQuery = (params?: RequestListSolutionsDto) =>
  useQuery({
    queryKey: solutionQueryKeys.list(params),
    queryFn: () => solutionAPI.findAll(params),
  })

export const useSolutionQuery = (id: string) =>
  useQuery({
    queryKey: solutionQueryKeys.detail(id),
    queryFn: () => solutionAPI.findOneById(id),
    enabled: !!id,
  })
