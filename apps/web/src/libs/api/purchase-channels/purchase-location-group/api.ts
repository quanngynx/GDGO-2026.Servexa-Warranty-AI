import { BaseApi } from '@/libs/axios'
import type {
  PurchaseLocationGroupApiResponse,
  RequestCreatePurchaseLocationGroupDto,
  RequestListPurchaseLocationGroupsDto,
  RequestUpdatePurchaseLocationGroupDto,
  ResponsePurchaseLocationGroupDto,
  ResponsePurchaseLocationGroupListDto,
} from './data-transfer-object'

class PurchaseLocationGroupAPI extends BaseApi {
  findAll(params?: RequestListPurchaseLocationGroupsDto) {
    return this.tryGet<PurchaseLocationGroupApiResponse<ResponsePurchaseLocationGroupListDto>>(
      '/v1/purchase-channels/purchase-location-groups',
      { params },
    )
  }

  findOneById(id: string) {
    return this.tryGet<PurchaseLocationGroupApiResponse<ResponsePurchaseLocationGroupDto>>(
      `/v1/purchase-channels/purchase-location-groups/${id}`,
    )
  }

  create(data: RequestCreatePurchaseLocationGroupDto) {
    return this.tryPost<
      PurchaseLocationGroupApiResponse<ResponsePurchaseLocationGroupDto>,
      RequestCreatePurchaseLocationGroupDto
    >('/v1/purchase-channels/purchase-location-groups', data)
  }

  update(id: string, data: RequestUpdatePurchaseLocationGroupDto) {
    return this.tryPatch<
      PurchaseLocationGroupApiResponse<ResponsePurchaseLocationGroupDto>,
      RequestUpdatePurchaseLocationGroupDto
    >(`/v1/purchase-channels/purchase-location-groups/${id}`, data)
  }

  delete(id: string) {
    return this.tryDelete<PurchaseLocationGroupApiResponse<{ success: boolean }>>(
      `/v1/purchase-channels/purchase-location-groups/${id}`,
    )
  }
}

export const purchaseLocationGroupAPI = new PurchaseLocationGroupAPI()
