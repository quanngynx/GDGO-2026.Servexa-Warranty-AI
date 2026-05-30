import { BaseApi } from '@/libs/axios'
import type {
  RequestLoginDto,
  ResponseLoginDto,
  ResponseLogoutDto,
  ResponseRefreshTokenDto,
  ResponseVerifyDto,
} from './data-transfer-object'

class AuthAPI extends BaseApi {
  login(username: string, password: string) {
    return this.tryPost<ResponseLoginDto, RequestLoginDto>(
      '/v1/identity/auth/login',
      { username, password },
      {
        _skipAccessTokenHeader: true,
        _skipAuthRefreshRetry: true,
      },
    )
  }

  logout(userId: string, accessToken: string, refreshToken: string) {
    return this.tryPost<ResponseLogoutDto, object>(
      '/v1/identity/auth/logout',
      {},
      {
        headers: {
          'x-client-id': userId,
          'refreshtoken': refreshToken,
          Authorization: `Bearer ${accessToken}`,
        },
        _skipAuthRefreshRetry: true,
      },
    )
  }

  refresh(userId: string, refreshToken: string) {
    return this.tryPost<ResponseRefreshTokenDto, object>(
      '/v1/identity/auth/refresh',
      {},
      {
        headers: {
          'x-client-id': userId,
          'refreshtoken': refreshToken,
        },
        _skipAccessTokenHeader: true,
        _skipAuthRefreshRetry: true,
      },
    )
  }

  me(userId: string, accessToken: string) {
    return this.tryGet<ResponseVerifyDto>('/v1/identity/auth/me', {
      headers: {
        'x-client-id': userId,
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }
}

export const authAPI = new AuthAPI()
