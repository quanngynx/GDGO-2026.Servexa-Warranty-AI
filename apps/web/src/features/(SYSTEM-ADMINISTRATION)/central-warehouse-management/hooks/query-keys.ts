import type { RequestListTotalWarehousesDto } from '@/libs/api/product-catalog/total-warehouse/data-transfer-object'

export const totalWarehouseQueryKeys = {
  all: ['total-warehouses'] as const,
  lists: () => [...totalWarehouseQueryKeys.all, 'list'] as const,
  list: (params?: RequestListTotalWarehousesDto) =>
    [...totalWarehouseQueryKeys.lists(), params] as const,
  details: () => [...totalWarehouseQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...totalWarehouseQueryKeys.details(), id] as const,
}
