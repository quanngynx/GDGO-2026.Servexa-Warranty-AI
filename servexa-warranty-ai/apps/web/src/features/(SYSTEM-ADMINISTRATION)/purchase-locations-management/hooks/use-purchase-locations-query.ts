import { useQuery } from '@tanstack/react-query'
import { purchaseLocationAPI } from '@/libs/api/purchase-channels/purchase-location/api'
import type { RequestListPurchaseLocationsDto } from '@/libs/api/purchase-channels/purchase-location/data-transfer-object'
import { purchaseLocationQueryKeys } from './query-keys'

export const usePurchaseLocationsQuery = (params?: RequestListPurchaseLocationsDto) =>
  useQuery({
    queryKey: purchaseLocationQueryKeys.list(params),
    queryFn: () => purchaseLocationAPI.findAll(params),
  })
