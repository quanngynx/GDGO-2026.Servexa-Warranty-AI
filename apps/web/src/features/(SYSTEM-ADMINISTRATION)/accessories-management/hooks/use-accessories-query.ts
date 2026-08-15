import { useQuery } from '@tanstack/react-query'
import { accessoryAPI } from '@/libs/api/product-catalog/accessory/api'
import type {
  AccessoryApiResponse,
  RequestListAccessoriesDto,
  ResponseAccessoryListDto,
  ResponseAscAccessoryListDto,
  ResponseTotalWarehouseAccessoryListDto,
} from '@/libs/api/product-catalog/accessory/data-transfer-object'
import { accessoryQueryKeys } from './query-keys'

type UseAccessoriesQueryParams = RequestListAccessoriesDto

export type AccessoriesQueryData = AccessoryApiResponse<
  | ResponseAccessoryListDto
  | ResponseTotalWarehouseAccessoryListDto
  | ResponseAscAccessoryListDto
>

export const useAccessoriesQuery = (params?: UseAccessoriesQueryParams) => {
  const warehouseId = params?.totalWarehouseIds?.split(',')[0]
  const ascCenterId = params?.ascCenterIds?.split(',')[0]

  return useQuery<AccessoriesQueryData | null>({
    queryKey: accessoryQueryKeys.list(params),
    queryFn: async () => {
      if (warehouseId) {
        return accessoryAPI.findAllFromTotalWarehouse(warehouseId, params) as Promise<AccessoriesQueryData | null>
      }
      if (ascCenterId) {
        return accessoryAPI.findAllFromAscCenter(ascCenterId, params) as Promise<AccessoriesQueryData | null>
      }
      return accessoryAPI.findAll(params)
    },
  })
}

