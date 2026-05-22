import { useQuery } from '@tanstack/react-query'
import { ascCenterAPI } from '@/libs/api/asc-center/asc-center/api'
import type { RequestListAscCentersDto } from '@/libs/api/asc-center/asc-center/data-transfer-object'
import { ascCenterQueryKeys } from './query-keys'

export const useAscCentersQuery = (params?: RequestListAscCentersDto) =>
  useQuery({
    queryKey: ascCenterQueryKeys.list(params),
    queryFn: () => ascCenterAPI.findAll(params),
  })
