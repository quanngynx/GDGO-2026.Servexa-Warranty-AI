import type { RequestListRepairCasesDto } from '@/libs/api/asc-center/repair-case/data-transfer-object'

export const repairCaseQueryKeys = {
  all: ['repair-cases'] as const,
  lists: () => [...repairCaseQueryKeys.all, 'list'] as const,
  list: (params?: RequestListRepairCasesDto) => [...repairCaseQueryKeys.lists(), params] as const,
}
