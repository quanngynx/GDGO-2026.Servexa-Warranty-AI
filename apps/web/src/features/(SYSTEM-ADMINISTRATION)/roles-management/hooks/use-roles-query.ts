import { useQuery } from '@tanstack/react-query'
import { roleAPI } from '@/libs/api/identity/role/api'
import type { RequestListRolesDto } from '@/libs/api/identity/role/data-transfer-object'
import { roleQueryKeys } from './query-keys'

export const useRolesQuery = (params?: RequestListRolesDto) =>
  useQuery({
    queryKey: roleQueryKeys.list(params),
    queryFn: () => roleAPI.findAll(params),
  })
