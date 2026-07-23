import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { warrantyPolicyAPI } from '@/libs/api/product-catalog/warranty-policy/api'
import type { RequestUpdateWarrantyPolicyDto } from '@/libs/api/product-catalog/warranty-policy/data-transfer-object'
import { warrantyPolicyQueryKeys } from './query-keys'

export const useUpdateWarrantyPolicyMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RequestUpdateWarrantyPolicyDto }) =>
      warrantyPolicyAPI.updateWarrantyPolicy(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: warrantyPolicyQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: warrantyPolicyQueryKeys.detail(id) })
      toast.success('WarrantyPolicy updated successfully')
    },
    onError: () => {
      toast.error('Failed to update WarrantyPolicy')
    }
  })
}
