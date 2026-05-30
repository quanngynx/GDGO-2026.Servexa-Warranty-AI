import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { totalWarehouseAPI } from '@/libs/api/product-catalog/total-warehouse/api'
import type { RequestUpdateTotalWarehouseDto } from '@/libs/api/product-catalog/total-warehouse/data-transfer-object'
import { totalWarehouseQueryKeys } from './query-keys'

export const useUpdateTotalWarehouseMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RequestUpdateTotalWarehouseDto }) =>
      totalWarehouseAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: totalWarehouseQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: totalWarehouseQueryKeys.detail(id) })
      toast.success('Warehouse updated successfully')
    },
  })
}
