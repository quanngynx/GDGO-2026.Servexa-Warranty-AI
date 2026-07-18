import { BaseApi } from '@/libs/axios'
import type {
  AccessoryApiResponse,
  RequestCreateAccessoryDto,
  RequestCreateAscAccessoryStockDto,
  RequestCreateTotalWarehouseStockDto,
  RequestListAccessoriesDto,
  RequestUpdateAccessoryDto,
  RequestUpdateAscAccessoryStockDto,
  RequestUpdateTotalWarehouseStockDto,
  ResponseAccessoryDto,
  ResponseAccessoryListDto,
  ResponseAscAccessoryListDto,
  ResponseAscStockItemDto,
  ResponseTotalWarehouseAccessoryListDto,
  ResponseTotalWarehouseStockItemDto,
} from './data-transfer-object'

class AccessoryAPI extends BaseApi {
  // --- Global Accessory Catalog Endpoints ---
  findAll(params?: RequestListAccessoriesDto) {
    return this.tryGet<AccessoryApiResponse<ResponseAccessoryListDto>>(
      '/v1/product-catalog/accessories',
      { params },
    )
  }

  findOneById(accessoryId: string) {
    return this.tryGet<AccessoryApiResponse<ResponseAccessoryDto>>(
      `/v1/product-catalog/accessories/${accessoryId}`,
    )
  }

  create(data: FormData | RequestCreateAccessoryDto) {
    const isFormData = data instanceof FormData
    return this.tryPost<AccessoryApiResponse<ResponseAccessoryDto>>(
      '/v1/product-catalog/accessories',
      data,
      isFormData
        ? {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        : undefined,
    )
  }

  update(accessoryId: string, data: FormData | RequestUpdateAccessoryDto) {
    const isFormData = data instanceof FormData
    return this.tryPatch<AccessoryApiResponse<ResponseAccessoryDto>>(
      `/v1/product-catalog/accessories/${accessoryId}`,
      data,
      isFormData
        ? {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        : undefined,
    )
  }

  delete(accessoryId: string) {
    return this.tryDelete<AccessoryApiResponse<{ success: true }>>(
      `/v1/product-catalog/accessories/${accessoryId}`,
    )
  }

  // --- Total Warehouse Stock Endpoints ---
  findAllFromTotalWarehouse(totalWarehouseId: string, params?: RequestListAccessoriesDto) {
    return this.tryGet<AccessoryApiResponse<ResponseTotalWarehouseAccessoryListDto>>(
      `/v1/product-catalog/accessories/total-warehouse/${totalWarehouseId}/accessories`,
      { params },
    )
  }

  createFromTotalWarehouse(
    totalWarehouseId: string,
    data: FormData | RequestCreateTotalWarehouseStockDto,
  ) {
    const isFormData = data instanceof FormData
    return this.tryPost<AccessoryApiResponse<ResponseTotalWarehouseStockItemDto>>(
      `/v1/product-catalog/accessories/total-warehouse/${totalWarehouseId}/accessories`,
      data,
      isFormData
        ? {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        : undefined,
    )
  }

  updateFromTotalWarehouse(
    totalWarehouseId: string,
    accessoryId: string,
    data: FormData | RequestUpdateTotalWarehouseStockDto,
  ) {
    const isFormData = data instanceof FormData
    return this.tryPatch<AccessoryApiResponse<ResponseTotalWarehouseStockItemDto>>(
      `/v1/product-catalog/accessories/total-warehouse/${totalWarehouseId}/accessories/${accessoryId}`,
      data,
      isFormData
        ? {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        : undefined,
    )
  }

  deleteFromTotalWarehouse(totalWarehouseId: string, accessoryId: string) {
    return this.tryDelete<AccessoryApiResponse<{ success: true }>>(
      `/v1/product-catalog/accessories/total-warehouse/${totalWarehouseId}/accessories/${accessoryId}`,
    )
  }

  // --- ASC Center Stock Endpoints ---
  findAllFromAscCenter(ascCenterId: string, params?: RequestListAccessoriesDto) {
    return this.tryGet<AccessoryApiResponse<ResponseAscAccessoryListDto>>(
      `/v1/product-catalog/accessories/asc-center/${ascCenterId}/accessories`,
      { params },
    )
  }

  createFromAscCenter(ascCenterId: string, data: FormData | RequestCreateAscAccessoryStockDto) {
    const isFormData = data instanceof FormData
    return this.tryPost<AccessoryApiResponse<ResponseAscStockItemDto>>(
      `/v1/product-catalog/accessories/asc-center/${ascCenterId}/accessories`,
      data,
      isFormData
        ? {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        : undefined,
    )
  }

  updateFromAscCenter(
    ascCenterId: string,
    accessoryId: string,
    data: FormData | RequestUpdateAscAccessoryStockDto,
  ) {
    const isFormData = data instanceof FormData
    return this.tryPatch<AccessoryApiResponse<ResponseAscStockItemDto>>(
      `/v1/product-catalog/accessories/asc-center/${ascCenterId}/accessories/${accessoryId}`,
      data,
      isFormData
        ? {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        : undefined,
    )
  }

  deleteFromAscCenter(ascCenterId: string, accessoryId: string) {
    return this.tryDelete<AccessoryApiResponse<{ success: true }>>(
      `/v1/product-catalog/accessories/asc-center/${ascCenterId}/accessories/${accessoryId}`,
    )
  }
}

export const accessoryAPI = new AccessoryAPI()
