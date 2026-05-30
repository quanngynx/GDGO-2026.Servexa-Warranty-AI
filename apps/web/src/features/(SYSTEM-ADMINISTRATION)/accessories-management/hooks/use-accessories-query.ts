import { useQuery } from '@tanstack/react-query'
import { accessoryAPI } from '@/libs/api/product-catalog/accessory/api'
import type { RequestListAccessoriesDto } from '@/libs/api/product-catalog/accessory/data-transfer-object'
import { accessoryQueryKeys } from './query-keys'

type UseAccessoriesQueryParams = RequestListAccessoriesDto & {
  totalWarehouseId?: string
  useGlobalList?: boolean
}

export const useAccessoriesQuery = (params?: UseAccessoriesQueryParams) => {
  const { totalWarehouseId, useGlobalList, ...listParams } = params ?? {}

  return useQuery({
    queryKey: accessoryQueryKeys.list(params),
    queryFn: () =>
      useGlobalList || !totalWarehouseId
        ? accessoryAPI.findAll(listParams)
        : accessoryAPI.findAllFromTotalWarehouse(totalWarehouseId, listParams),
    enabled: useGlobalList === true || Boolean(totalWarehouseId),
  })
}
