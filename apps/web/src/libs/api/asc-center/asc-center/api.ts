import { BaseApi } from '@/libs/axios'
import type {
  AscCenterApiResponse,
  RequestCreateAscCenterDto,
  RequestListAscCentersDto,
  RequestUpdateAscCenterDto,
  ResponseAscCenterDto,
  ResponseAscCenterListDto,
} from './data-transfer-object'

class AscCenterAPI extends BaseApi {
  findAll(params?: RequestListAscCentersDto) {
    return this.tryGet<AscCenterApiResponse<ResponseAscCenterListDto>>(
      '/v1/asc-center/asc-centers',
      { params },
    )
  }

  findOneById(id: string) {
    return this.tryGet<AscCenterApiResponse<ResponseAscCenterDto>>(
      `/v1/asc-center/asc-centers/${id}`,
    )
  }

  create(data: RequestCreateAscCenterDto) {
    return this.tryPost<AscCenterApiResponse<ResponseAscCenterDto>, RequestCreateAscCenterDto>(
      '/v1/asc-center/asc-centers',
      data,
    )
  }

  update(id: string, data: RequestUpdateAscCenterDto) {
    return this.tryPatch<AscCenterApiResponse<ResponseAscCenterDto>, RequestUpdateAscCenterDto>(
      `/v1/asc-center/asc-centers/${id}`,
      data,
    )
  }

  delete(id: string) {
    return this.tryDelete<AscCenterApiResponse<{ success: boolean }>>(
      `/v1/asc-center/asc-centers/${id}`,
    )
  }
}

export const ascCenterAPI = new AscCenterAPI()
