import { BaseApi } from '@/libs/axios'
import type {
  SolutionApiResponse,
  RequestCreateSolutionDto,
  RequestListSolutionsDto,
  RequestUpdateSolutionDto,
  ResponseSolutionDto,
  ResponseSolutionListDto,
} from './data-transfer-object'

class SolutionAPI extends BaseApi {
  findAll(params?: RequestListSolutionsDto) {
    return this.tryGet<SolutionApiResponse<ResponseSolutionListDto>>('/v1/product-catalog/solutions', {
      params,
    })
  }

  findOneById(solutionId: string) {
    return this.tryGet<SolutionApiResponse<ResponseSolutionDto>>(
      `/v1/product-catalog/solutions/${solutionId}`,
    )
  }

  createSolution(data: RequestCreateSolutionDto) {
    return this.tryPost<SolutionApiResponse<ResponseSolutionDto>, RequestCreateSolutionDto>(
      '/v1/product-catalog/solutions',
      data,
    )
  }

  updateSolution(solutionId: string, data: RequestUpdateSolutionDto) {
    return this.tryPatch<SolutionApiResponse<ResponseSolutionDto>, RequestUpdateSolutionDto>(
      `/v1/product-catalog/solutions/${solutionId}`,
      data,
    )
  }
  
  replaceSolution(solutionId: string, data: RequestCreateSolutionDto) {
    return this.tryPut<SolutionApiResponse<ResponseSolutionDto>, RequestCreateSolutionDto>(
      `/v1/product-catalog/solutions/${solutionId}`,
      data,
    )
  }

  deleteSolution(solutionId: string) {
    return this.tryDelete<SolutionApiResponse<{ success: boolean }>>(
      `/v1/product-catalog/solutions/${solutionId}`,
    )
  }

  export() {
    return this.tryGet<Blob>('/v1/product-catalog/solutions/export', { responseType: 'blob' })
  }

  import(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return this.tryPost<SolutionApiResponse<{ success: boolean }>, FormData>(
      '/v1/product-catalog/solutions/import',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  }

  importLink(url: string) {
    return this.tryPost<SolutionApiResponse<{ success: boolean }>, { url: string }>(
      '/v1/product-catalog/solutions/import-link',
      { url }
    )
  }
}

export const solutionAPI = new SolutionAPI()
