import type { RequestListRolesDto } from '@/libs/api/identity/role/data-transfer-object'

export const roleQueryKeys = {
  all: ['roles'] as const,
  lists: () => [...roleQueryKeys.all, 'list'] as const,
  list: (params?: RequestListRolesDto) => [...roleQueryKeys.lists(), params] as const,
  details: () => [...roleQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleQueryKeys.details(), id] as const,
}
