import { useQuery } from '@tanstack/react-query'
import { userQueryKeys } from './query-keys'
import { userAPI } from '@/libs/api/identity/user/api'
import type { RequestListUsersDto } from '@/libs/api/identity/user/data-transfer-object'

export const useUsersQuery = (params?: RequestListUsersDto) =>
  useQuery({
    queryKey: userQueryKeys.list(params),
    queryFn: () => userAPI.findAll(params),
  })
