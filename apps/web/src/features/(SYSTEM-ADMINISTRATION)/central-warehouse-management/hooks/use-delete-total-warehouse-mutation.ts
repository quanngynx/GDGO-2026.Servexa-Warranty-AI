import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { totalWarehouseAPI } from '@/libs/api/product-catalog/total-warehouse/api'
import { totalWarehouseQueryKeys } from './query-keys'

export const useDeleteTotalWarehouseMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => totalWarehouseAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: totalWarehouseQueryKeys.lists() })
      toast.success('Warehouse deleted successfully')
    },
  })
}
