import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { customerAPI } from '@/libs/api/human-resources/customer/api'
import type { RequestCreateCustomerDto } from '@/libs/api/human-resources/customer/data-transfer-object'
import { customerQueryKeys } from './query-keys'

export const useCreateCustomerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RequestCreateCustomerDto) => customerAPI.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerQueryKeys.lists() })
      toast.success('Customer created successfully')
    },
  })
}
