import { BaseApi } from '@/libs/axios'
import type {
  RequestCreateUserDto,
  RequestListUsersDto,
  RequestUpdateUserDto,
  ResponseUserDto,
  ResponseUserListDto,
  UserApiResponse,
} from './data-transfer-object'

class UserAPI extends BaseApi {
  constructor() {
    super()
  }

  findAll(params?: RequestListUsersDto) {
    return this.tryGet<UserApiResponse<ResponseUserListDto>>('/v1/identity/users', { params })
  }

  findOneById(userId: string) {
    return this.tryGet<UserApiResponse<ResponseUserDto>>(`/v1/identity/users/${userId}`)
  }

  createUser(data: RequestCreateUserDto) {
    return this.tryPost<UserApiResponse<ResponseUserDto>, RequestCreateUserDto>(
      '/v1/identity/users',
      data
    )
  }

  updateUser(userId: string, data: RequestUpdateUserDto) {
    return this.tryPatch<UserApiResponse<ResponseUserDto>, RequestUpdateUserDto>(
      `/v1/identity/users/${userId}`,
      data
    )
  }

  deleteUser(userId: string) {
    return this.tryDelete<UserApiResponse<boolean>>(`/v1/identity/users/${userId}`)
  }

  restoreUser(userId: string) {
    return this.tryPatch<UserApiResponse<boolean>, Record<string, never>>(
      `/v1/identity/users/${userId}/restore`,
      {}
    )
  }
}

export const userAPI = new UserAPI()
