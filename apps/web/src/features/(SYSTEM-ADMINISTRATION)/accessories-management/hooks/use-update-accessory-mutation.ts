import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { accessoryAPI } from '@/libs/api/product-catalog/accessory/api'
import type {
  AccessoryApiResponse,
  RequestUpdateAccessoryDto,
  RequestUpdateAscAccessoryStockDto,
  RequestUpdateTotalWarehouseStockDto,
  ResponseAccessoryDto,
  ResponseAscStockItemDto,
  ResponseTotalWarehouseStockItemDto,
} from '@/libs/api/product-catalog/accessory/data-transfer-object'
import { accessoryQueryKeys } from './query-keys'

type UpdateAccessoryMutationPayload = {
  accessoryId: string
  data: FormData | RequestUpdateAccessoryDto | RequestUpdateTotalWarehouseStockDto | RequestUpdateAscAccessoryStockDto
  totalWarehouseId?: string
  ascCenterId?: string
}

export type UpdateAccessoryMutationData = AccessoryApiResponse<
  ResponseAccessoryDto | ResponseTotalWarehouseStockItemDto | ResponseAscStockItemDto
>

export const useUpdateAccessoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<UpdateAccessoryMutationData | null, Error, UpdateAccessoryMutationPayload>({
    mutationFn: async ({ accessoryId, data, totalWarehouseId, ascCenterId }: UpdateAccessoryMutationPayload) => {
      if (totalWarehouseId) {
        return accessoryAPI.updateFromTotalWarehouse(
          totalWarehouseId,
          accessoryId,
          data as FormData | RequestUpdateTotalWarehouseStockDto,
        ) as Promise<UpdateAccessoryMutationData | null>
      }
      if (ascCenterId) {
        return accessoryAPI.updateFromAscCenter(
          ascCenterId,
          accessoryId,
          data as FormData | RequestUpdateAscAccessoryStockDto,
        ) as Promise<UpdateAccessoryMutationData | null>
      }
      return accessoryAPI.update(accessoryId, data as FormData | RequestUpdateAccessoryDto) as Promise<UpdateAccessoryMutationData | null>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accessoryQueryKeys.all })
      toast.success('Accessory updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update accessory')
    },
  })
}

