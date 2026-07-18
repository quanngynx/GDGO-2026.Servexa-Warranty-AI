import { BaseApi } from '@/libs/axios'
import type {
  ErrorPhenomenonApiResponse,
  RequestCreateErrorPhenomenonDto,
  RequestListErrorPhenomenonsDto,
  RequestUpdateErrorPhenomenonDto,
  ResponseErrorPhenomenonDto,
  ResponseErrorPhenomenonListDto,
} from './data-transfer-object'

class ErrorPhenomenonAPI extends BaseApi {
  findAll(params?: RequestListErrorPhenomenonsDto) {
    return this.tryGet<ErrorPhenomenonApiResponse<ResponseErrorPhenomenonListDto>>('/v1/product-catalog/error-phenomena', {
      params,
    })
  }

  findOneById(errorPhenomenonId: string) {
    return this.tryGet<ErrorPhenomenonApiResponse<ResponseErrorPhenomenonDto>>(
      `/v1/product-catalog/error-phenomena/${errorPhenomenonId}`,
    )
  }

  createErrorPhenomenon(data: RequestCreateErrorPhenomenonDto) {
    return this.tryPost<ErrorPhenomenonApiResponse<ResponseErrorPhenomenonDto>, RequestCreateErrorPhenomenonDto>(
      '/v1/product-catalog/error-phenomena',
      data,
    )
  }

  updateErrorPhenomenon(errorPhenomenonId: string, data: RequestUpdateErrorPhenomenonDto) {
    return this.tryPatch<ErrorPhenomenonApiResponse<ResponseErrorPhenomenonDto>, RequestUpdateErrorPhenomenonDto>(
      `/v1/product-catalog/error-phenomena/${errorPhenomenonId}`,
      data,
    )
  }
  
  replaceErrorPhenomenon(errorPhenomenonId: string, data: RequestCreateErrorPhenomenonDto) {
    return this.tryPut<ErrorPhenomenonApiResponse<ResponseErrorPhenomenonDto>, RequestCreateErrorPhenomenonDto>(
      `/v1/product-catalog/error-phenomena/${errorPhenomenonId}`,
      data,
    )
  }

  deleteErrorPhenomenon(errorPhenomenonId: string) {
    return this.tryDelete<ErrorPhenomenonApiResponse<{ success: boolean }>>(
      `/v1/product-catalog/error-phenomena/${errorPhenomenonId}`,
    )
  }

  export() {
    return this.tryGet<Blob>('/v1/product-catalog/error-phenomena/export', { responseType: 'blob' })
  }

  import(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return this.tryPost<ErrorPhenomenonApiResponse<{ success: boolean }>, FormData>(
      '/v1/product-catalog/error-phenomena/import',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  }

  importLink(url: string) {
    return this.tryPost<ErrorPhenomenonApiResponse<{ success: boolean }>, { url: string }>(
      '/v1/product-catalog/error-phenomena/import-link',
      { url }
    )
  }
}

export const errorPhenomenonAPI = new ErrorPhenomenonAPI()
