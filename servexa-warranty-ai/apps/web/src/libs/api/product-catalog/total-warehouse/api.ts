import { BaseApi } from '@/libs/axios'
import type {
  RequestCreateTotalWarehouseDto,
  RequestListTotalWarehousesDto,
  RequestUpdateTotalWarehouseDto,
  ResponseTotalWarehouseDto,
  ResponseTotalWarehouseListDto,
  TotalWarehouseApiResponse,
} from './data-transfer-object'

class TotalWarehouseAPI extends BaseApi {
  findAll(params?: RequestListTotalWarehousesDto) {
    return this.tryGet<TotalWarehouseApiResponse<ResponseTotalWarehouseListDto>>(
      '/v1/product-catalog/total-warehouses',
      { params },
    )
  }

  findOneById(id: string) {
    return this.tryGet<TotalWarehouseApiResponse<ResponseTotalWarehouseDto>>(
      `/v1/product-catalog/total-warehouses/${id}`,
    )
  }

  create(data: RequestCreateTotalWarehouseDto) {
    return this.tryPost<
      TotalWarehouseApiResponse<ResponseTotalWarehouseDto>,
      RequestCreateTotalWarehouseDto
    >('/v1/product-catalog/total-warehouses', data)
  }

  update(id: string, data: RequestUpdateTotalWarehouseDto) {
    return this.tryPatch<
      TotalWarehouseApiResponse<ResponseTotalWarehouseDto>,
      RequestUpdateTotalWarehouseDto
    >(`/v1/product-catalog/total-warehouses/${id}`, data)
  }

  delete(id: string) {
    return this.tryDelete<TotalWarehouseApiResponse<{ success: boolean }>>(
      `/v1/product-catalog/total-warehouses/${id}`,
    )
  }
}

export const totalWarehouseAPI = new TotalWarehouseAPI()
