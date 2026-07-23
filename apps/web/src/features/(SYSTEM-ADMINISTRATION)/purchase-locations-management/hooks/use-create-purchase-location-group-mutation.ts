import { useMutation, useQueryClient } from '@tanstack/react-query'
import { purchaseLocationGroupAPI } from '@/libs/api/purchase-channels/purchase-location-group/api'
import type { RequestCreatePurchaseLocationGroupDto } from '@/libs/api/purchase-channels/purchase-location-group/data-transfer-object'
import { purchaseLocationGroupsQueryKeys } from './query-keys'

export function useCreatePurchaseLocationGroupMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RequestCreatePurchaseLocationGroupDto) => purchaseLocationGroupAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseLocationGroupsQueryKeys.lists() })
    },
  })
}
