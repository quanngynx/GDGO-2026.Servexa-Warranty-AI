import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ascCenterAPI } from '@/libs/api/asc-center/asc-center/api'
import { ascCenterQueryKeys } from './query-keys'

export const useDeleteAscCenterMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ascCenterAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ascCenterQueryKeys.lists() })
      toast.success('ASC center deleted successfully')
    },
  })
}
