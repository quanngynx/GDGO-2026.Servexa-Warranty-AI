import type { RequestListUsersDto } from '@/libs/api/identity/user/data-transfer-object'

export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (params?: RequestListUsersDto) => [...userQueryKeys.lists(), params] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
}
