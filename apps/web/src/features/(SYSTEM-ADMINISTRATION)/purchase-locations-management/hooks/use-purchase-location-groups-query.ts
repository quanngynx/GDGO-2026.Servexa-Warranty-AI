import { useQuery } from '@tanstack/react-query'
import { purchaseLocationGroupAPI } from '@/libs/api/purchase-channels/purchase-location-group/api'
import type { RequestListPurchaseLocationGroupsDto } from '@/libs/api/purchase-channels/purchase-location-group/data-transfer-object'
import { purchaseLocationGroupsQueryKeys } from './query-keys'

export function usePurchaseLocationGroupsQuery(params?: RequestListPurchaseLocationGroupsDto) {
  return useQuery({
    queryKey: purchaseLocationGroupsQueryKeys.list(params),
    queryFn: () => purchaseLocationGroupAPI.findAll(params),
  })
}
