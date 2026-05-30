import type { RequestListAccessoriesDto } from '@/libs/api/product-catalog/accessory/data-transfer-object'

export const accessoryQueryKeys = {
  all: ['accessories'] as const,
  lists: () => [...accessoryQueryKeys.all, 'list'] as const,
  list: (params?: RequestListAccessoriesDto & { totalWarehouseId?: string }) =>
    [...accessoryQueryKeys.lists(), params] as const,
}
