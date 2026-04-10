import { create } from 'zustand'
import {
  AuthService,
  TokenRefreshService,
  TokenService,
} from './services/service-auth'
import { attachLogoutBroadcastListener, postLogoutBroadcast } from '@/libs/broadcast-channel-for-auth'
import type { AuthSessionUser } from '@/libs/to-auth-session-user'

interface QueuedRequest {
  resolve: (value: string) => void
  reject: (error: Error) => void
}

type LogoutOptions = {
  skipBroadcast?: boolean
}

interface AuthState {
  isLoading: boolean
  isAuthenticated: boolean
  isInitialized: boolean
  error: string | null
  success: string | null
  user: AuthSessionUser | null
  isRefreshing: boolean
  failedQueue: QueuedRequest[]
  auth: {
    initializeAuth: () => Promise<void>
    login: (
      username: string,
      password: string,
    ) => Promise<{ success: boolean; error?: string }>
    logout: (options?: LogoutOptions) => Promise<void>
    getSessionId: () => Promise<string | undefined>
    getRefreshToken: () => Promise<string | undefined>
    getToken: () => Promise<string | undefined>
    getPairToken: () => Promise<{
      refreshToken: string | undefined
      token: string | undefined
    }>
    setUser: (user: AuthSessionUser | null) => void
    setTokens: (
      accessToken: string,
      refreshToken: string,
      sessionId?: string,
    ) => void
    removeSessionId: () => Promise<void>
    removeRefreshToken: () => Promise<void>
    removeToken: () => Promise<void>
    processQueue: (error: Error | null, token: string) => void
    refreshAccessToken: () => Promise<string>
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  isLoading: true,
  isAuthenticated: false,
  isInitialized: false,
  error: null,
  success: null,
  user: null,
  isRefreshing: false,
  failedQueue: [],
  auth: {
    initializeAuth: async () => {
      attachLogoutBroadcastListener()

      if (get().isInitialized) {
        return
      }

      set({ isLoading: true })

      const result = await AuthService.initializeAuth()

      set({
        isAuthenticated: result.isAuthenticated,
        user: result.user,
        isLoading: false,
        isInitialized: true,
        error: null,
        success: null,
      })
    },

    login: async (username: string, password: string) => {
      set({
        isLoading: true,
        isAuthenticated: false,
        error: null,
        success: null,
      })

      const result = await AuthService.login(username, password)

      if (result.success && result.user) {
        set({
          isLoading: false,
          isAuthenticated: true,
          isInitialized: true,
          user: result.user,
          success: 'Login successful! Welcome back.',
          error: null,
        })
        return { success: true }
      }

      const errorMessage = result.error ?? 'Login failed. Please try again.'
      set({
        isLoading: false,
        success: null,
        error: errorMessage,
      })
      return { success: false, error: errorMessage }
    },

    logout: async (options?: LogoutOptions) => {
      if (!options?.skipBroadcast) {
        postLogoutBroadcast()
      }

      await AuthService.logout()

      set({
        isLoading: false,
        isAuthenticated: false,
        isInitialized: true,
        error: null,
        success: null,
        user: null,
      })
    },

    getSessionId: TokenService.getSessionId,
    getRefreshToken: TokenService.getRefreshToken,
    getToken: TokenService.getToken,
    getPairToken: TokenService.getPairToken,

    setUser: (user: AuthSessionUser | null) => {
      set({ user })
    },

    setTokens: (
      accessToken: string,
      refreshToken: string,
      sessionId?: string,
    ) => {
      TokenService.setTokens(accessToken, refreshToken, sessionId)
      set({ isAuthenticated: true, isInitialized: true })
    },

    removeSessionId: TokenService.removeSessionId,
    removeRefreshToken: TokenService.removeRefreshToken,

    removeToken: async () => {
      await TokenService.removeToken()
      set({ isAuthenticated: false, isInitialized: true })
    },

    processQueue: (error: Error | null, token: string) => {
      const { failedQueue } = get()
      failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
          reject(error)
        } else {
          resolve(token)
        }
      })
      set({ failedQueue: [] })
    },

    refreshAccessToken: async (): Promise<string> => {
      const state = get()

      if (state.isRefreshing) {
        return new Promise((resolve, reject) => {
          set({
            failedQueue: [...state.failedQueue, { resolve, reject }],
          })
        })
      }

      set({ isRefreshing: true })

      try {
        const token = await TokenRefreshService.refreshAccessToken()
        get().auth.processQueue(null, token)
        set({ isAuthenticated: true, isInitialized: true })
        return token
      } catch (error) {
        get().auth.processQueue(
          error instanceof Error ? error : new Error('Refresh failed'),
          '',
        )
        set({ isAuthenticated: false, isInitialized: true })
        throw error
      } finally {
        set({ isRefreshing: false })
      }
    },

    reset: () => {
      TokenService.removeAllTokens()
      set({
        isLoading: false,
        isAuthenticated: false,
        isInitialized: false,
        error: null,
        success: null,
        user: null,
        isRefreshing: false,
        failedQueue: [],
      })
    },
  },
}))

export type { AuthSessionUser }
