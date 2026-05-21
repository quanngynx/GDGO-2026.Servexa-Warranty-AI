import { useQuery } from '@tanstack/react-query'
import { totalWarehouseAPI } from '@/libs/api/product-catalog/total-warehouse/api'
import type { RequestListTotalWarehousesDto } from '@/libs/api/product-catalog/total-warehouse/data-transfer-object'
import { totalWarehouseQueryKeys } from './query-keys'

export const useTotalWarehousesQuery = (params?: RequestListTotalWarehousesDto) =>
  useQuery({
    queryKey: totalWarehouseQueryKeys.list(params),
    queryFn: () => totalWarehouseAPI.findAll(params),
  })
