import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { modelAPI } from '@/libs/api/product-catalog/model/api'
import { modelQueryKeys } from './query-keys'

export const useImportModelMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FormData) => modelAPI.importModel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modelQueryKeys.lists() })
      toast.success('Models imported successfully')
    },
    onError: (error) => {
      toast.error('Failed to import models')
      console.error(error)
    }
  })
}
