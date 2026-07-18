import { BaseApi } from '@/libs/axios'
import type {
  WarrantyPolicyApiResponse,
  RequestCreateWarrantyPolicyDto,
  RequestListWarrantyPoliciesDto,
  RequestUpdateWarrantyPolicyDto,
  ResponseWarrantyPolicyDto,
  ResponseWarrantyPolicyListDto,
  RequestResolveWarrantyPolicyDto,
} from './data-transfer-object'

class WarrantyPolicyAPI extends BaseApi {
  findAll(params?: RequestListWarrantyPoliciesDto) {
    return this.tryGet<WarrantyPolicyApiResponse<ResponseWarrantyPolicyListDto>>('/v1/product-catalog/warranty-policies', {
      params,
    })
  }

  findOneById(warrantyPolicyId: string) {
    return this.tryGet<WarrantyPolicyApiResponse<ResponseWarrantyPolicyDto>>(
      `/v1/product-catalog/warranty-policies/${warrantyPolicyId}`,
    )
  }

  createWarrantyPolicy(data: RequestCreateWarrantyPolicyDto) {
    return this.tryPost<WarrantyPolicyApiResponse<ResponseWarrantyPolicyDto>, RequestCreateWarrantyPolicyDto>(
      '/v1/product-catalog/warranty-policies',
      data,
    )
  }

  updateWarrantyPolicy(warrantyPolicyId: string, data: RequestUpdateWarrantyPolicyDto) {
    return this.tryPatch<WarrantyPolicyApiResponse<ResponseWarrantyPolicyDto>, RequestUpdateWarrantyPolicyDto>(
      `/v1/product-catalog/warranty-policies/${warrantyPolicyId}`,
      data,
    )
  }
  
  replaceWarrantyPolicy(warrantyPolicyId: string, data: RequestCreateWarrantyPolicyDto) {
    return this.tryPut<WarrantyPolicyApiResponse<ResponseWarrantyPolicyDto>, RequestCreateWarrantyPolicyDto>(
      `/v1/product-catalog/warranty-policies/${warrantyPolicyId}`,
      data,
    )
  }

  deleteWarrantyPolicy(warrantyPolicyId: string) {
    return this.tryDelete<WarrantyPolicyApiResponse<{ success: boolean }>>(
      `/v1/product-catalog/warranty-policies/${warrantyPolicyId}`,
    )
  }

  resolve(params: RequestResolveWarrantyPolicyDto) {
    return this.tryGet<WarrantyPolicyApiResponse<ResponseWarrantyPolicyDto>>('/v1/product-catalog/warranty-policies/resolve', {
      params,
    })
  }
}

export const warrantyPolicyAPI = new WarrantyPolicyAPI()
