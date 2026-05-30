import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { purchaseLocationAPI } from '@/libs/api/purchase-channels/purchase-location/api'
import type { RequestUpdatePurchaseLocationDto } from '@/libs/api/purchase-channels/purchase-location/data-transfer-object'
import { purchaseLocationQueryKeys } from './query-keys'

export const useUpdatePurchaseLocationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RequestUpdatePurchaseLocationDto }) =>
      purchaseLocationAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: purchaseLocationQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: purchaseLocationQueryKeys.detail(id) })
      toast.success('Purchase location updated successfully')
    },
  })
}
