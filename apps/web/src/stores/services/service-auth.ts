import { clearCookie, getCookie, setCookie } from '@servexa-warranty-ai/ui/lib/cookie'

import { KEY_COOKIE } from '@/constants'
import { authAPI } from '@/libs/api/identity/auth/api'
import { getAuthCookieDomain, mapLoginError } from '@servexa-warranty-ai/ui/lib/utils'
import { toAuthSessionUser, type AuthSessionUser } from '@/libs/to-auth-session-user'

export class AuthService {
  static isAuthenticated(): boolean {
    const token = getCookie(KEY_COOKIE.AUTH_TOKEN)
    return !!token
  }

  static async login(
    username: string,
    password: string,
  ): Promise<{
    success: boolean
    user?: AuthSessionUser
    error?: string
  }> {
    try {
      const response = await authAPI.login(username, password)

      if (!response?.metadata) {
        return {
          success: false,
          error: 'Incorrect username or password',
        }
      }

      const {
        user,
        accessToken,
        refreshToken,
        expiresInAccessToken,
        expiresInRefreshToken,
      } = response.metadata

      const accessDays = expiresInAccessToken / 86_400
      const refreshDays = expiresInRefreshToken / 86_400

      TokenService.setAuthSession(
        accessToken,
        refreshToken,
        user.id,
        accessDays,
        refreshDays,
      )

      return {
        success: true,
        user: toAuthSessionUser(user),
      }
    } catch (error) {
      return {
        success: false,
        error: mapLoginError(error),
      }
    }
  }

  static async logout(): Promise<void> {
    const userId = getCookie(KEY_COOKIE.AUTH_CLIENT_ID)
    const accessToken = getCookie(KEY_COOKIE.AUTH_TOKEN)
    const refreshToken = getCookie(KEY_COOKIE.REFRESH_TOKEN)

    if (userId && accessToken && refreshToken) {
      try {
        await authAPI.logout(userId, accessToken, refreshToken)
      } catch {
        // Always clear local session even if revocation fails
      }
    }

    TokenService.removeAllTokens()
  }

  static async initializeAuth(): Promise<{
    isAuthenticated: boolean
    hasToken: boolean
    user: AuthSessionUser | null
  }> {
    const token = getCookie(KEY_COOKIE.AUTH_TOKEN)
    const userId = getCookie(KEY_COOKIE.AUTH_CLIENT_ID)

    if (!token || !userId) {
      return {
        isAuthenticated: false,
        hasToken: false,
        user: null,
      }
    }

    try {
      const response = await authAPI.me(userId, token)
      if (!response?.metadata) {
        TokenService.removeAllTokens()
        return {
          isAuthenticated: false,
          hasToken: false,
          user: null,
        }
      }

      return {
        isAuthenticated: true,
        hasToken: true,
        user: toAuthSessionUser(response.metadata),
      }
    } catch {
      TokenService.removeAllTokens()
      return {
        isAuthenticated: false,
        hasToken: false,
        user: null,
      }
    }
  }
}

export class TokenService {
  static async getSessionId(): Promise<string | undefined> {
    return getCookie(KEY_COOKIE.SESSION_ID) ?? undefined
  }

  static async getRefreshToken(): Promise<string | undefined> {
    return getCookie(KEY_COOKIE.REFRESH_TOKEN) ?? undefined
  }

  static async getToken(): Promise<string | undefined> {
    return getCookie(KEY_COOKIE.AUTH_TOKEN) ?? undefined
  }

  static async getClientId(): Promise<string | undefined> {
    return getCookie(KEY_COOKIE.AUTH_CLIENT_ID) ?? undefined
  }

  static async getPairToken(): Promise<{
    refreshToken: string | undefined
    token: string | undefined
  }> {
    return {
      refreshToken: getCookie(KEY_COOKIE.REFRESH_TOKEN) ?? undefined,
      token: getCookie(KEY_COOKIE.AUTH_TOKEN) ?? undefined,
    }
  }

  static setToken(accessToken: string, maxAgeDays: number): void {
    setCookie(
      KEY_COOKIE.AUTH_TOKEN,
      accessToken,
      getAuthCookieDomain(),
      maxAgeDays,
    )
  }

  static setAuthSession(
    accessToken: string,
    refreshToken: string,
    userId: string,
    accessTtlDays: number,
    refreshTtlDays: number,
  ): void {
    const domain = getAuthCookieDomain()
    setCookie(
      KEY_COOKIE.AUTH_TOKEN,
      accessToken,
      domain,
      accessTtlDays,
    )
    setCookie(
      KEY_COOKIE.REFRESH_TOKEN,
      refreshToken,
      domain,
      refreshTtlDays,
    )
    setCookie(
      KEY_COOKIE.AUTH_CLIENT_ID,
      userId,
      domain,
      refreshTtlDays,
    )
  }

  static setTokens(
    accessToken: string,
    refreshToken: string,
    sessionId?: string,
  ): void {
    const domain = getAuthCookieDomain()
    setCookie(KEY_COOKIE.AUTH_TOKEN, accessToken, domain, 7)
    setCookie(KEY_COOKIE.REFRESH_TOKEN, refreshToken, domain, 7)
    if (sessionId) {
      setCookie(KEY_COOKIE.SESSION_ID, sessionId, domain, 7)
    }
  }

  static async removeSessionId(): Promise<void> {
    clearCookie(KEY_COOKIE.SESSION_ID, getAuthCookieDomain())
  }

  static async removeRefreshToken(): Promise<void> {
    clearCookie(KEY_COOKIE.REFRESH_TOKEN, getAuthCookieDomain())
  }

  static async removeToken(): Promise<void> {
    clearCookie(KEY_COOKIE.AUTH_TOKEN, getAuthCookieDomain())
  }

  static removeAllTokens(): void {
    const domain = getAuthCookieDomain()
    clearCookie(KEY_COOKIE.AUTH_TOKEN, domain)
    clearCookie(KEY_COOKIE.REFRESH_TOKEN, domain)
    clearCookie(KEY_COOKIE.SESSION_ID, domain)
    clearCookie(KEY_COOKIE.AUTH_CLIENT_ID, domain)
  }
}

export class TokenRefreshService {
  static async refreshAccessToken(): Promise<string> {
    const refreshToken = await TokenService.getRefreshToken()
    const userId = await TokenService.getClientId()
    if (!refreshToken || !userId) {
      throw new Error('No refresh token')
    }

    const response = await authAPI.refresh(userId, refreshToken)
    if (!response?.metadata) {
      throw new Error('Refresh failed')
    }

    const {
      accessToken,
      refreshToken: newRefresh,
      expiresInAccessToken,
      expiresInRefreshToken,
    } = response.metadata

    const accessDays = expiresInAccessToken / 86_400
    const refreshDays = expiresInRefreshToken / 86_400

    TokenService.setAuthSession(
      accessToken,
      newRefresh,
      userId,
      accessDays,
      refreshDays,
    )

    return accessToken
  }
}
