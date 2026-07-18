import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { solutionAPI } from '@/libs/api/product-catalog/solution/api'
import type { RequestUpdateSolutionDto } from '@/libs/api/product-catalog/solution/data-transfer-object'
import { solutionQueryKeys } from './query-keys'

export const useUpdateSolutionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RequestUpdateSolutionDto }) =>
      solutionAPI.updateSolution(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: solutionQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: solutionQueryKeys.detail(id) })
      toast.success('Solution updated successfully')
    },
    onError: () => {
      toast.error('Failed to update Solution')
    }
  })
}
