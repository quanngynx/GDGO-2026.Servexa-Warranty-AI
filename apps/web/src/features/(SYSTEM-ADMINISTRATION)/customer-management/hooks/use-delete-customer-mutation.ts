import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { customerAPI } from '@/libs/api/human-resources/customer/api'
import { customerQueryKeys } from './query-keys'

export const useDeleteCustomerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (customerId: string) => customerAPI.deleteCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerQueryKeys.lists() })
      toast.success('Customer deleted successfully')
    },
  })
}
