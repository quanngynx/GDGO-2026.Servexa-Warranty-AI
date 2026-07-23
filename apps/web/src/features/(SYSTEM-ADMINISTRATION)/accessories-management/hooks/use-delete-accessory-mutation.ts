import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { accessoryAPI } from '@/libs/api/product-catalog/accessory/api'
import { accessoryQueryKeys } from './query-keys'

type DeleteAccessoryMutationPayload = {
  accessoryId: string
  totalWarehouseId?: string
  ascCenterId?: string
}

export const useDeleteAccessoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ accessoryId, totalWarehouseId, ascCenterId }: DeleteAccessoryMutationPayload) => {
      if (totalWarehouseId) {
        return accessoryAPI.deleteFromTotalWarehouse(totalWarehouseId, accessoryId)
      }
      if (ascCenterId) {
        return accessoryAPI.deleteFromAscCenter(ascCenterId, accessoryId)
      }
      return accessoryAPI.delete(accessoryId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accessoryQueryKeys.all })
      toast.success('Accessory deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete accessory')
    },
  })
}
