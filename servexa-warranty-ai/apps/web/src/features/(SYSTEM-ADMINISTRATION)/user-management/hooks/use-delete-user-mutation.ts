import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userAPI } from '@/libs/api/user/api'
import { userQueryKeys } from './query-keys'

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => userAPI.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
      toast.success('User deleted successfully')
    },
  })
}
