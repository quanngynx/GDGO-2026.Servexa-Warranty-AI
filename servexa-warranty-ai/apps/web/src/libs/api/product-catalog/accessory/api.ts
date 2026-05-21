import { BaseApi } from '@/libs/axios'
import type {
  AccessoryApiResponse,
  RequestListAccessoriesDto,
  ResponseAccessoryListDto,
} from './data-transfer-object'

class AccessoryAPI extends BaseApi {
  findAll(params?: RequestListAccessoriesDto) {
    return this.tryGet<AccessoryApiResponse<ResponseAccessoryListDto>>(
      '/v1/product-catalog/accessories',
      { params },
    )
  }

  findAllFromTotalWarehouse(totalWarehouseId: string, params?: RequestListAccessoriesDto) {
    return this.tryGet<AccessoryApiResponse<ResponseAccessoryListDto>>(
      `/v1/product-catalog/accessories/total-warehouse/${totalWarehouseId}/accessories`,
      { params },
    )
  }
}

export const accessoryAPI = new AccessoryAPI()
