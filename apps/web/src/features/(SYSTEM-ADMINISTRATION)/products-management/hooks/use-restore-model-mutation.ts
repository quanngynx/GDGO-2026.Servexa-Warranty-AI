import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { modelAPI } from '@/libs/api/product-catalog/model/api'
import { modelQueryKeys } from './query-keys'

export const useRestoreModelMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (modelId: string) => modelAPI.restoreModel(modelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modelQueryKeys.lists() })
      toast.success('Model restored successfully')
    },
    onError: (error) => {
      toast.error('Failed to restore model')
      console.error(error)
    }
  })
}
