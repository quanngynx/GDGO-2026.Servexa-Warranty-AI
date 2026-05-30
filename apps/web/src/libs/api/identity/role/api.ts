import { BaseApi } from '@/libs/axios'
import type {
  RequestCreateRoleDto,
  RequestListRolesDto,
  ResponseRoleDto,
  RoleApiResponse,
} from './data-transfer-object'

class RoleAPI extends BaseApi {
  findAll(params?: RequestListRolesDto) {
    return this.tryGet<RoleApiResponse<ResponseRoleDto[]>>('/v1/identity/roles', {
      params,
    })
  }

  findOneById(roleId: string) {
    return this.tryGet<RoleApiResponse<ResponseRoleDto>>(`/v1/identity/roles/${roleId}`)
  }

  createRole(data: RequestCreateRoleDto) {
    return this.tryPost<RoleApiResponse<ResponseRoleDto>, RequestCreateRoleDto>(
      '/v1/identity/roles',
      data,
    )
  }
}

export const roleAPI = new RoleAPI()
