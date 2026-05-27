import { useQuery } from '@tanstack/react-query'
import { permissionAPI } from '@/libs/api/identity/permission/api'
import type { RequestListPermissionsDto } from '@/libs/api/identity/permission/data-transfer-object'
import { permissionQueryKeys } from './query-keys'

export const usePermissionsQuery = (params?: RequestListPermissionsDto) =>
  useQuery({
    queryKey: permissionQueryKeys.list(params),
    queryFn: () => permissionAPI.findAll(params),
  })
