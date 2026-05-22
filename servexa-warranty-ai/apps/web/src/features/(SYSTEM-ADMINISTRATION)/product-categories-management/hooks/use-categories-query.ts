import { useQuery } from '@tanstack/react-query'
import { categoryAPI } from '@/libs/api/product-catalog/category/api'
import type { RequestListCategoriesDto } from '@/libs/api/product-catalog/category/data-transfer-object'
import { categoryQueryKeys } from './query-keys'

export const useCategoriesQuery = (params?: RequestListCategoriesDto) =>
  useQuery({
    queryKey: categoryQueryKeys.list(params),
    queryFn: () => categoryAPI.findAll(params),
  })
