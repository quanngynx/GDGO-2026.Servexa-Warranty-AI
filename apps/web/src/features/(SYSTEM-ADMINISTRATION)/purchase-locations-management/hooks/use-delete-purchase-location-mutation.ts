import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { purchaseLocationAPI } from '@/libs/api/purchase-channels/purchase-location/api'
import { purchaseLocationQueryKeys } from './query-keys'

export const useDeletePurchaseLocationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => purchaseLocationAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseLocationQueryKeys.lists() })
      toast.success('Purchase location deleted successfully')
    },
  })
}
