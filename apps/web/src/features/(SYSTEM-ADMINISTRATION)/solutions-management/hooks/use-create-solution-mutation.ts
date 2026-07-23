import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { solutionAPI } from '@/libs/api/product-catalog/solution/api'
import type { RequestCreateSolutionDto } from '@/libs/api/product-catalog/solution/data-transfer-object'
import { solutionQueryKeys } from './query-keys'

export const useCreateSolutionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RequestCreateSolutionDto) => solutionAPI.createSolution(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: solutionQueryKeys.lists() })
      toast.success('Solution created successfully')
    },
    onError: () => {
      toast.error('Failed to create Solution')
    }
  })
}
