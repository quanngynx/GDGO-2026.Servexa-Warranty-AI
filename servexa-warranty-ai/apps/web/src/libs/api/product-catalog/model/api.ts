import { BaseApi } from '@/libs/axios'
import type {
  ModelApiResponse,
  RequestCreateModelDto,
  RequestListModelsDto,
  RequestUpdateModelDto,
  ResponseModelDto,
  ResponseModelListDto,
} from './data-transfer-object'

class ModelAPI extends BaseApi {
  findAll(params?: RequestListModelsDto) {
    return this.tryGet<ModelApiResponse<ResponseModelListDto>>('/v1/product-catalog/models', {
      params,
    })
  }

  findOneById(modelId: string) {
    return this.tryGet<ModelApiResponse<ResponseModelDto>>(
      `/v1/product-catalog/models/${modelId}`,
    )
  }

  createModel(data: RequestCreateModelDto) {
    return this.tryPost<ModelApiResponse<ResponseModelDto>, RequestCreateModelDto>(
      '/v1/product-catalog/models',
      data,
    )
  }

  updateModel(modelId: string, data: RequestUpdateModelDto) {
    return this.tryPatch<ModelApiResponse<ResponseModelDto>, RequestUpdateModelDto>(
      `/v1/product-catalog/models/${modelId}`,
      data,
    )
  }

  deleteModel(modelId: string) {
    return this.tryDelete<ModelApiResponse<{ success: boolean }>>(
      `/v1/product-catalog/models/${modelId}`,
    )
  }
}

export const modelAPI = new ModelAPI()
