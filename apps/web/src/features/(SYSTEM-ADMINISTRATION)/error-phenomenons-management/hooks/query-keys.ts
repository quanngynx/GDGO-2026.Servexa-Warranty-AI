import type { RequestListErrorPhenomenonsDto } from '@/libs/api/product-catalog/error-phenomenon/data-transfer-object'

export const errorPhenomenonQueryKeys = {
  all: ['error-phenomenons'] as const,
  lists: () => [...errorPhenomenonQueryKeys.all, 'list'] as const,
  list: (params?: RequestListErrorPhenomenonsDto) => [...errorPhenomenonQueryKeys.lists(), params] as const,
  details: () => [...errorPhenomenonQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...errorPhenomenonQueryKeys.details(), id] as const,
}
