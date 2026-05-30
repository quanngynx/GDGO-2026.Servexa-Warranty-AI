import { useQuery } from '@tanstack/react-query'
import { repairCaseAPI } from '@/libs/api/asc-center/repair-case/api'
import type { RequestListRepairCasesDto } from '@/libs/api/asc-center/repair-case/data-transfer-object'
import { repairCaseQueryKeys } from './query-keys'

export const useRepairCasesQuery = (params?: RequestListRepairCasesDto) =>
  useQuery({
    queryKey: repairCaseQueryKeys.list(params),
    queryFn: () => repairCaseAPI.findAll(params),
  })
