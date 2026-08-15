import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { accessoryAPI } from '@/libs/api/product-catalog/accessory/api'
import type {
  AccessoryApiResponse,
  RequestCreateAccessoryDto,
  RequestCreateAscAccessoryStockDto,
  RequestCreateTotalWarehouseStockDto,
  ResponseAccessoryDto,
  ResponseAscStockItemDto,
  ResponseTotalWarehouseStockItemDto,
} from '@/libs/api/product-catalog/accessory/data-transfer-object'
import { accessoryQueryKeys } from './query-keys'

type CreateAccessoryMutationPayload = {
  data: FormData | RequestCreateAccessoryDto | RequestCreateTotalWarehouseStockDto | RequestCreateAscAccessoryStockDto
  totalWarehouseId?: string
  ascCenterId?: string
}

export type CreateAccessoryMutationData = AccessoryApiResponse<
  ResponseAccessoryDto | ResponseTotalWarehouseStockItemDto | ResponseAscStockItemDto
>

export const useCreateAccessoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateAccessoryMutationData | null, Error, CreateAccessoryMutationPayload>({
    mutationFn: async ({ data, totalWarehouseId, ascCenterId }: CreateAccessoryMutationPayload) => {
      if (totalWarehouseId) {
        return accessoryAPI.createFromTotalWarehouse(
          totalWarehouseId,
          data as FormData | RequestCreateTotalWarehouseStockDto,
        ) as Promise<CreateAccessoryMutationData | null>
      }
      if (ascCenterId) {
        return accessoryAPI.createFromAscCenter(
          ascCenterId,
          data as FormData | RequestCreateAscAccessoryStockDto,
        ) as Promise<CreateAccessoryMutationData | null>
      }
      return accessoryAPI.create(data as FormData | RequestCreateAccessoryDto)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accessoryQueryKeys.all })
      toast.success('Accessory created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create accessory')
    },
  })
}

