import { useQuery } from '@tanstack/react-query'
import { totalWarehouseAPI } from '@/libs/api/product-catalog/total-warehouse/api'

export const totalWarehouseListQueryKey = ['total-warehouses', 'list'] as const

export const useTotalWarehousesQuery = () =>
  useQuery({
    queryKey: totalWarehouseListQueryKey,
    queryFn: () => totalWarehouseAPI.findAll({ page: 1, limit: 100 }),
  })
