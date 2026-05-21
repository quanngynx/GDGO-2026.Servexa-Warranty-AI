import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { permissionAPI } from '@/libs/api/identity/permission/api'
import { permissionQueryKeys } from './query-keys'

export const useDeletePermissionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (permissionId: string) => permissionAPI.deletePermission(permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionQueryKeys.lists() })
      toast.success('Permission deleted successfully')
    },
  })
}
