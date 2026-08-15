import { useQuery } from '@tanstack/react-query'
import { modelAPI } from '@/libs/api/product-catalog/model/api'
import { modelQueryKeys } from './query-keys'

export const useModelQuery = (modelId: string, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: modelQueryKeys.detail(modelId),
    queryFn: () => modelAPI.findOneById(modelId),
    enabled: options?.enabled,
  })
