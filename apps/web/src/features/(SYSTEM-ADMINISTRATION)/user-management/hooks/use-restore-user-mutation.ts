import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userAPI } from '@/libs/api/identity/user/api'
import { userQueryKeys } from './query-keys'

export const useRestoreUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => userAPI.restoreUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
      toast.success('User restored successfully')
    },
  })
}
