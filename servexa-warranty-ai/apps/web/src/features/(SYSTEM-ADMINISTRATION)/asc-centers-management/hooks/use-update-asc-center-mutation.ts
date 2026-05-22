import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ascCenterAPI } from '@/libs/api/asc-center/asc-center/api'
import type { RequestUpdateAscCenterDto } from '@/libs/api/asc-center/asc-center/data-transfer-object'
import { ascCenterQueryKeys } from './query-keys'

export const useUpdateAscCenterMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RequestUpdateAscCenterDto }) =>
      ascCenterAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ascCenterQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ascCenterQueryKeys.detail(id) })
      toast.success('ASC center updated successfully')
    },
  })
}
