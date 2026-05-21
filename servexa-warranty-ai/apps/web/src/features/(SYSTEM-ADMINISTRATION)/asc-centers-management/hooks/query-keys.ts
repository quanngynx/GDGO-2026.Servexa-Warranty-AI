import type { RequestListAscCentersDto } from '@/libs/api/asc-center/asc-center/data-transfer-object'

export const ascCenterQueryKeys = {
  all: ['asc-centers'] as const,
  lists: () => [...ascCenterQueryKeys.all, 'list'] as const,
  list: (params?: RequestListAscCentersDto) => [...ascCenterQueryKeys.lists(), params] as const,
  details: () => [...ascCenterQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...ascCenterQueryKeys.details(), id] as const,
}
