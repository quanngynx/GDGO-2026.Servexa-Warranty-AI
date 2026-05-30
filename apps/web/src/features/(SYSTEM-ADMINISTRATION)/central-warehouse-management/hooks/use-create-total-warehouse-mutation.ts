import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { totalWarehouseAPI } from '@/libs/api/product-catalog/total-warehouse/api'
import type { RequestCreateTotalWarehouseDto } from '@/libs/api/product-catalog/total-warehouse/data-transfer-object'
import { totalWarehouseQueryKeys } from './query-keys'

export const useCreateTotalWarehouseMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RequestCreateTotalWarehouseDto) => totalWarehouseAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: totalWarehouseQueryKeys.lists() })
      toast.success('Warehouse created successfully')
    },
  })
}
