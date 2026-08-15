import { useQuery } from '@tanstack/react-query'
import { warrantyPolicyAPI } from '@/libs/api/product-catalog/warranty-policy/api'
import type { RequestResolveWarrantyPolicyDto } from '@/libs/api/product-catalog/warranty-policy/data-transfer-object'
import { warrantyPolicyQueryKeys } from './query-keys'

export const useResolveWarrantyPolicyQuery = (params: RequestResolveWarrantyPolicyDto, enabled = true) =>
  useQuery({
    queryKey: warrantyPolicyQueryKeys.resolve(params),
    queryFn: () => warrantyPolicyAPI.resolve(params),
    enabled: enabled && !!params.warrantyType,
  })
