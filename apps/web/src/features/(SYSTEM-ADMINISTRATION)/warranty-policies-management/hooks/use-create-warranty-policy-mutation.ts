import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { warrantyPolicyAPI } from '@/libs/api/product-catalog/warranty-policy/api'
import type { RequestCreateWarrantyPolicyDto } from '@/libs/api/product-catalog/warranty-policy/data-transfer-object'
import { warrantyPolicyQueryKeys } from './query-keys'

export const useCreateWarrantyPolicyMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RequestCreateWarrantyPolicyDto) => warrantyPolicyAPI.createWarrantyPolicy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warrantyPolicyQueryKeys.lists() })
      toast.success('WarrantyPolicy created successfully')
    },
    onError: () => {
      toast.error('Failed to create WarrantyPolicy')
    }
  })
}
