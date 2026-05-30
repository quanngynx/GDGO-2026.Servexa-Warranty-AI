import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ascCenterAPI } from '@/libs/api/asc-center/asc-center/api'
import type { RequestCreateAscCenterDto } from '@/libs/api/asc-center/asc-center/data-transfer-object'
import { ascCenterQueryKeys } from './query-keys'

export const useCreateAscCenterMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RequestCreateAscCenterDto) => ascCenterAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ascCenterQueryKeys.lists() })
      toast.success('ASC center created successfully')
    },
  })
}
