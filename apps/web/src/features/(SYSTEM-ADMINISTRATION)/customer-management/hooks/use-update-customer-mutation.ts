import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { customerAPI } from '@/libs/api/human-resources/customer/api'
import type { RequestUpdateCustomerDto } from '@/libs/api/human-resources/customer/data-transfer-object'
import { customerQueryKeys } from './query-keys'

export const useUpdateCustomerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RequestUpdateCustomerDto }) =>
      customerAPI.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerQueryKeys.lists() })
      toast.success('Customer updated successfully')
    },
  })
}
