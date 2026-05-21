import { BaseApi } from '@/libs/axios'
import type {
  PermissionApiResponse,
  RequestCreatePermissionDto,
  RequestListPermissionsDto,
  RequestUpdatePermissionDto,
  ResponsePermissionDto,
  ResponsePermissionListDto,
} from './data-transfer-object'

class PermissionAPI extends BaseApi {
  findAll(params?: RequestListPermissionsDto) {
    return this.tryGet<PermissionApiResponse<ResponsePermissionListDto>>(
      '/v1/identity/permissions',
      { params },
    )
  }

  findOneById(permissionId: string) {
    return this.tryGet<PermissionApiResponse<ResponsePermissionDto>>(
      `/v1/identity/permissions/${permissionId}`,
    )
  }

  createPermission(data: RequestCreatePermissionDto) {
    return this.tryPost<PermissionApiResponse<ResponsePermissionDto>, RequestCreatePermissionDto>(
      '/v1/identity/permissions',
      data,
    )
  }

  updatePermission(permissionId: string, data: RequestUpdatePermissionDto) {
    return this.tryPatch<PermissionApiResponse<ResponsePermissionDto>, RequestUpdatePermissionDto>(
      `/v1/identity/permissions/${permissionId}`,
      data,
    )
  }

  deletePermission(permissionId: string) {
    return this.tryDelete<PermissionApiResponse<{ success: boolean }>>(
      `/v1/identity/permissions/${permissionId}`,
    )
  }
}

export const permissionAPI = new PermissionAPI()
