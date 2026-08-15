import { useQuery } from '@tanstack/react-query'
import { warrantyPolicyAPI } from '@/libs/api/product-catalog/warranty-policy/api'
import type { RequestListWarrantyPoliciesDto } from '@/libs/api/product-catalog/warranty-policy/data-transfer-object'
import { warrantyPolicyQueryKeys } from './query-keys'

export const useWarrantyPoliciesQuery = (params?: RequestListWarrantyPoliciesDto) =>
  useQuery({
    queryKey: warrantyPolicyQueryKeys.list(params),
    queryFn: () => warrantyPolicyAPI.findAll(params),
  })

export const useWarrantyPolicyQuery = (id: string) =>
  useQuery({
    queryKey: warrantyPolicyQueryKeys.detail(id),
    queryFn: () => warrantyPolicyAPI.findOneById(id),
    enabled: !!id,
  })
