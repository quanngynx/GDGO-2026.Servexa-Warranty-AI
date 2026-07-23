import type { RequestListWarrantyPoliciesDto } from '@/libs/api/product-catalog/warranty-policy/data-transfer-object'

export const warrantyPolicyQueryKeys = {
  all: ['warranty-policies'] as const,
  lists: () => [...warrantyPolicyQueryKeys.all, 'list'] as const,
  list: (params?: RequestListWarrantyPoliciesDto) => [...warrantyPolicyQueryKeys.lists(), params] as const,
  details: () => [...warrantyPolicyQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...warrantyPolicyQueryKeys.details(), id] as const,
  resolves: () => [...warrantyPolicyQueryKeys.all, 'resolve'] as const,
  resolve: (params: any) => [...warrantyPolicyQueryKeys.resolves(), params] as const,
}
