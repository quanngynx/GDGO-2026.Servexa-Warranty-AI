import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { modelAPI } from '@/libs/api/product-catalog/model/api'
import { modelQueryKeys } from './query-keys'

export const useDeleteModelMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (modelId: string) => modelAPI.deleteModel(modelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modelQueryKeys.lists() })
      toast.success('Model deleted successfully')
    },
  })
}
