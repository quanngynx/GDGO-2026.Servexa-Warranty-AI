import type { RequestListPermissionsDto } from '@/libs/api/identity/permission/data-transfer-object'

export const permissionQueryKeys = {
  all: ['permissions'] as const,
  lists: () => [...permissionQueryKeys.all, 'list'] as const,
  list: (params?: RequestListPermissionsDto) =>
    [...permissionQueryKeys.lists(), params] as const,
  details: () => [...permissionQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...permissionQueryKeys.details(), id] as const,
}
