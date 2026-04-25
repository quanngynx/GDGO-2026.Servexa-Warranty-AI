import type { z } from 'zod'

import type {
  CreateWarrantyPolicyDto,
  ReplaceWarrantyPolicyDto,
  ResolveWarrantyPolicyDto,
  UpdateWarrantyPolicyDto,
} from '../dtos/warranty-policy.dto'
import type { findAllWarrantyPoliciesSchema } from '../validations'

type FindAllWarrantyPoliciesInput = z.infer<typeof findAllWarrantyPoliciesSchema>

export interface IWarrantyPolicyService {
  findAll(query: FindAllWarrantyPoliciesInput): Promise<unknown>
  findOneById(warrantyPolicyId: string): Promise<unknown>
  create(input: CreateWarrantyPolicyDto): Promise<unknown>
  update(warrantyPolicyId: string, input: ReplaceWarrantyPolicyDto | UpdateWarrantyPolicyDto): Promise<unknown>
  delete(warrantyPolicyId: string): Promise<{ success: true }>
  resolve(input: ResolveWarrantyPolicyDto): Promise<unknown>
}
