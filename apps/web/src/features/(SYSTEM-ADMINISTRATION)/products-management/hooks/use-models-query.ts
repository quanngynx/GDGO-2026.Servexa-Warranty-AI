import { useQuery } from '@tanstack/react-query'
import { modelAPI } from '@/libs/api/product-catalog/model/api'
import type { RequestListModelsDto } from '@/libs/api/product-catalog/model/data-transfer-object'
import { modelQueryKeys } from './query-keys'

export const useModelsQuery = (params?: RequestListModelsDto) =>
  useQuery({
    queryKey: modelQueryKeys.list(params),
    queryFn: () => modelAPI.findAll(params),
  })
