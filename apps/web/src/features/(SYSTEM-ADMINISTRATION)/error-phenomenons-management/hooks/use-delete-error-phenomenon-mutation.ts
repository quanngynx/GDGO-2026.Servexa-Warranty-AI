import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { errorPhenomenonAPI } from '@/libs/api/product-catalog/error-phenomenon/api'
import { errorPhenomenonQueryKeys } from './query-keys'

export const useDeleteErrorPhenomenonMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => errorPhenomenonAPI.deleteErrorPhenomenon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: errorPhenomenonQueryKeys.lists() })
      toast.success('ErrorPhenomenon deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete ErrorPhenomenon')
    }
  })
}
