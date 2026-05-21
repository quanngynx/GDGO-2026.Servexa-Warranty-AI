import type { RequestListCustomersDto } from '@/libs/api/human-resources/customer/data-transfer-object'

export const customerQueryKeys = {
  all: ['customers'] as const,
  lists: () => [...customerQueryKeys.all, 'list'] as const,
  list: (params?: RequestListCustomersDto) =>
    [...customerQueryKeys.lists(), params] as const,
  details: () => [...customerQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerQueryKeys.details(), id] as const,
}
