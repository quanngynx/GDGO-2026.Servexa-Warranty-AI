import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { modelAPI } from '@/libs/api/product-catalog/model/api'
import type { RequestCreateModelDto } from '@/libs/api/product-catalog/model/data-transfer-object'
import { modelQueryKeys } from './query-keys'

export const useCreateModelMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RequestCreateModelDto) => modelAPI.createModel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modelQueryKeys.lists() })
      toast.success('Model created successfully')
    },
  })
}
