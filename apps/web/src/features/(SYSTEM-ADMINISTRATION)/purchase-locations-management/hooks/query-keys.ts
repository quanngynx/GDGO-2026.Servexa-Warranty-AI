import type { RequestListPurchaseLocationsDto } from '@/libs/api/purchase-channels/purchase-location/data-transfer-object'
import type { RequestListPurchaseLocationGroupsDto } from '@/libs/api/purchase-channels/purchase-location-group/data-transfer-object'

export const purchaseLocationQueryKeys = {
  all: ['purchase-locations'] as const,
  lists: () => [...purchaseLocationQueryKeys.all, 'list'] as const,
  list: (params?: RequestListPurchaseLocationsDto) =>
    [...purchaseLocationQueryKeys.lists(), params] as const,
  details: () => [...purchaseLocationQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...purchaseLocationQueryKeys.details(), id] as const,
}

export const purchaseLocationGroupsQueryKeys = {
  all: ['purchase-location-groups'] as const,
  lists: () => [...purchaseLocationGroupsQueryKeys.all, 'list'] as const,
  list: (params?: RequestListPurchaseLocationGroupsDto) =>
    [...purchaseLocationGroupsQueryKeys.lists(), params] as const,
  details: () => [...purchaseLocationGroupsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...purchaseLocationGroupsQueryKeys.details(), id] as const,
}
