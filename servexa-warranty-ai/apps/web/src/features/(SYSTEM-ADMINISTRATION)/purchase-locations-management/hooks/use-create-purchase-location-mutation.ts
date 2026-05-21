import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { purchaseLocationAPI } from '@/libs/api/purchase-channels/purchase-location/api'
import type { RequestCreatePurchaseLocationDto } from '@/libs/api/purchase-channels/purchase-location/data-transfer-object'
import { purchaseLocationQueryKeys } from './query-keys'

export const useCreatePurchaseLocationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RequestCreatePurchaseLocationDto) => purchaseLocationAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseLocationQueryKeys.lists() })
      toast.success('Purchase location created successfully')
    },
  })
}
