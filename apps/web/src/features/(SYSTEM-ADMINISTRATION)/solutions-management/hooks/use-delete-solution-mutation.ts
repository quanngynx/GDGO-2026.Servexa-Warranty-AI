import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { solutionAPI } from '@/libs/api/product-catalog/solution/api'
import { solutionQueryKeys } from './query-keys'

export const useDeleteSolutionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => solutionAPI.deleteSolution(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: solutionQueryKeys.lists() })
      toast.success('Solution deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete Solution')
    }
  })
}
