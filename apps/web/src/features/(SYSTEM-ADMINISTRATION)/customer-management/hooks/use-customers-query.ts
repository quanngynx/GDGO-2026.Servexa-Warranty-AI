import { useQuery } from '@tanstack/react-query'
import { customerAPI } from '@/libs/api/human-resources/customer/api'
import type { RequestListCustomersDto } from '@/libs/api/human-resources/customer/data-transfer-object'
import { customerQueryKeys } from './query-keys'

export const useCustomersQuery = (params?: RequestListCustomersDto) =>
  useQuery({
    queryKey: customerQueryKeys.list(params),
    queryFn: () => customerAPI.findAll(params),
  })
