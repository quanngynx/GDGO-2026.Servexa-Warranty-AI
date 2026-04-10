import { useQuery } from '@tanstack/react-query'
import { userAPI } from '@/libs/api/user/api'
import type { RequestListUsersDto } from '@/libs/api/user/data-transfer-object'
import { userQueryKeys } from './query-keys'

export const useUsersQuery = (params?: RequestListUsersDto) =>
  useQuery({
    queryKey: userQueryKeys.list(params),
    queryFn: () => userAPI.findAll(params),
  })
