import { useQuery } from '@tanstack/react-query'
import { repairCaseAPI } from '@/libs/api/asc-center/repair-case/api'
import { repairCaseQueryKeys } from './query-keys'

export const useRepairCaseDetailQuery = (id: string) =>
  useQuery({
    queryKey: repairCaseQueryKeys.detail(id),
    queryFn: () => repairCaseAPI.findOneById(id),
    enabled: !!id,
  })
