import { BaseApi } from '@/libs/axios'
import type {
  PurchaseLocationApiResponse,
  RequestCreatePurchaseLocationDto,
  RequestListPurchaseLocationsDto,
  RequestUpdatePurchaseLocationDto,
  ResponsePurchaseLocationDto,
  ResponsePurchaseLocationListDto,
} from './data-transfer-object'

class PurchaseLocationAPI extends BaseApi {
  findAll(params?: RequestListPurchaseLocationsDto) {
    return this.tryGet<PurchaseLocationApiResponse<ResponsePurchaseLocationListDto>>(
      '/v1/purchase-channels/purchase-locations',
      { params },
    )
  }

  findOneById(id: string) {
    return this.tryGet<PurchaseLocationApiResponse<ResponsePurchaseLocationDto>>(
      `/v1/purchase-channels/purchase-locations/${id}`,
    )
  }

  create(data: RequestCreatePurchaseLocationDto) {
    return this.tryPost<
      PurchaseLocationApiResponse<ResponsePurchaseLocationDto>,
      RequestCreatePurchaseLocationDto
    >('/v1/purchase-channels/purchase-locations', data)
  }

  update(id: string, data: RequestUpdatePurchaseLocationDto) {
    return this.tryPatch<
      PurchaseLocationApiResponse<ResponsePurchaseLocationDto>,
      RequestUpdatePurchaseLocationDto
    >(`/v1/purchase-channels/purchase-locations/${id}`, data)
  }

  delete(id: string) {
    return this.tryDelete<PurchaseLocationApiResponse<{ success: boolean }>>(
      `/v1/purchase-channels/purchase-locations/${id}`,
    )
  }
}

export const purchaseLocationAPI = new PurchaseLocationAPI()
