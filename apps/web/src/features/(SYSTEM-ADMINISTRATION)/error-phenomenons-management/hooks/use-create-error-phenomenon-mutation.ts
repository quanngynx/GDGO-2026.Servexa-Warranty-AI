import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { errorPhenomenonAPI } from '@/libs/api/product-catalog/error-phenomenon/api'
import type { RequestCreateErrorPhenomenonDto } from '@/libs/api/product-catalog/error-phenomenon/data-transfer-object'
import { errorPhenomenonQueryKeys } from './query-keys'

export const useCreateErrorPhenomenonMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RequestCreateErrorPhenomenonDto) => errorPhenomenonAPI.createErrorPhenomenon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: errorPhenomenonQueryKeys.lists() })
      toast.success('ErrorPhenomenon created successfully')
    },
    onError: () => {
      toast.error('Failed to create ErrorPhenomenon')
    }
  })
}
