import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { modelAPI } from '@/libs/api/product-catalog/model/api'
import type { RequestUpdateModelDto } from '@/libs/api/product-catalog/model/data-transfer-object'
import { modelQueryKeys } from './query-keys'

export const useUpdateModelMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ modelId, data }: { modelId: string; data: RequestUpdateModelDto }) =>
      modelAPI.updateModel(modelId, data),
    onSuccess: (_, { modelId }) => {
      queryClient.invalidateQueries({ queryKey: modelQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: modelQueryKeys.detail(modelId) })
      toast.success('Model updated successfully')
    },
  })
}
