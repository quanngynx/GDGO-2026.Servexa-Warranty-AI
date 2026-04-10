import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userAPI } from '@/libs/api/user/api'
import type { RequestUpdateUserDto } from '@/libs/api/user/data-transfer-object'
import { userQueryKeys } from './query-keys'

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: RequestUpdateUserDto }) =>
      userAPI.updateUser(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(userId) })
      toast.success('User updated successfully')
    },
  })
}
