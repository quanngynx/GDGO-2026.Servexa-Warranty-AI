import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userAPI } from '@/libs/api/user/api'
import type { RequestCreateUserDto } from '@/libs/api/user/data-transfer-object'
import { userQueryKeys } from './query-keys'

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RequestCreateUserDto) => userAPI.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
      toast.success('User created successfully')
    },
  })
}
