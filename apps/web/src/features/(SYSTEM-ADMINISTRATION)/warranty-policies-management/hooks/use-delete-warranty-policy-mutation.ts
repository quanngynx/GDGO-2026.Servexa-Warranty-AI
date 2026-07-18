import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { warrantyPolicyAPI } from '@/libs/api/product-catalog/warranty-policy/api'
import { warrantyPolicyQueryKeys } from './query-keys'

export const useDeleteWarrantyPolicyMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => warrantyPolicyAPI.deleteWarrantyPolicy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warrantyPolicyQueryKeys.lists() })
      toast.success('WarrantyPolicy deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete WarrantyPolicy')
    }
  })
}
