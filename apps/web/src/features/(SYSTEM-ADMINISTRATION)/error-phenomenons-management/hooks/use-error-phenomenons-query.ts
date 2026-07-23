import { useQuery } from '@tanstack/react-query'
import { errorPhenomenonAPI } from '@/libs/api/product-catalog/error-phenomenon/api'
import type { RequestListErrorPhenomenonsDto } from '@/libs/api/product-catalog/error-phenomenon/data-transfer-object'
import { errorPhenomenonQueryKeys } from './query-keys'

export const useErrorPhenomenonsQuery = (params?: RequestListErrorPhenomenonsDto) =>
  useQuery({
    queryKey: errorPhenomenonQueryKeys.list(params),
    queryFn: () => errorPhenomenonAPI.findAll(params),
  })

export const useErrorPhenomenonQuery = (id: string) =>
  useQuery({
    queryKey: errorPhenomenonQueryKeys.detail(id),
    queryFn: () => errorPhenomenonAPI.findOneById(id),
    enabled: !!id,
  })
