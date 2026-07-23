import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { errorPhenomenonAPI } from '@/libs/api/product-catalog/error-phenomenon/api'
import type { RequestUpdateErrorPhenomenonDto } from '@/libs/api/product-catalog/error-phenomenon/data-transfer-object'
import { errorPhenomenonQueryKeys } from './query-keys'

export const useUpdateErrorPhenomenonMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RequestUpdateErrorPhenomenonDto }) =>
      errorPhenomenonAPI.updateErrorPhenomenon(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: errorPhenomenonQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: errorPhenomenonQueryKeys.detail(id) })
      toast.success('ErrorPhenomenon updated successfully')
    },
    onError: () => {
      toast.error('Failed to update ErrorPhenomenon')
    }
  })
}
