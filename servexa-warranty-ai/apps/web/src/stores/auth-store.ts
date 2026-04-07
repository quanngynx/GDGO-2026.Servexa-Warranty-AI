import { create } from "zustand";
import {
  AuthService,
  TokenRefreshService,
  TokenService,
} from "./services/service-auth";

interface AuthUser {
  accountNo: string;
  email: string;
  role: string[];
  exp: number;
}

interface QueuedRequest {
  resolve: (value: string) => void;
  reject: (error: Error) => void;
}

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  error: string | null;
  success: string | null;
  user: AuthUser | null;
  // Token refresh state
  isRefreshing: boolean;
  failedQueue: QueuedRequest[];
  auth: {
    initializeAuth: () => void;
    login: (
      email: string,
      password: string
    ) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    getSessionId: () => Promise<string | undefined>;
    getRefreshToken: () => Promise<string | undefined>;
    getToken: () => Promise<string | undefined>;
    getPairToken: () => Promise<{
      refreshToken: string | undefined;
      token: string | undefined;
    }>;
    setUser: (user: AuthUser | null) => void;
    setTokens: (
      accessToken: string,
      refreshToken: string,
      sessionId?: string
    ) => void;
    removeSessionId: () => Promise<void>;
    removeRefreshToken: () => Promise<void>;
    removeToken: () => Promise<void>;
    processQueue: (error: Error | null, token: string) => void;
    refreshAccessToken: () => Promise<string>;
    reset: () => void;
  };
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  isLoading: true,
  isAuthenticated: false,
  isInitialized: false,
  error: null,
  success: null,
  user: null,
  // Token refresh state
  isRefreshing: false,
  failedQueue: [],
  auth: {
    initializeAuth: () => {
      // Prevent multiple initializations
      if (get().isInitialized) {
        return;
      }

      set({ isLoading: true });

      const { isAuthenticated } = AuthService.initializeAuth();

      set({
        isAuthenticated,
        isLoading: false,
        isInitialized: true,
        error: null,
        success: null,
      });
    },
    /**
     * Authenticates a user by logging in with their email and password.
     * If the authentication is successful, the user's authentication tokens
     * will be stored in cookies and the state will be set to authenticated.
     * If the authentication fails, the state will be set to not authenticated
     * and an error message will be set.
     * @param username The user's username
     * @param password The user's password
     */
    login: async (username: string, password: string) => {
      set({
        isLoading: true,
        isAuthenticated: false,
        error: null,
        success: null,
      });

      const result = await AuthService.login(username, password);

      if (result.success) {
        set({
          isLoading: false,
          isAuthenticated: true,
          isInitialized: true,
          success: "Login successful! Welcome back.",
          error: null,
        });
        return { success: true };
      }

      const errorMessage = result.error || "Login failed. Please try again.";
      set({
        isLoading: false,
        success: null,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    },

    /**
     * Logs out the current user.
     * The user's authentication tokens will be removed from cookies
     * and the state will be set to not authenticated.
     * This function is idempotent, i.e. multiple calls will not have any effect.
     * @return {void}
     * */
    logout: (): void => {
      AuthService.logout();
      set({
        isLoading: false,
        isAuthenticated: false,
        isInitialized: true,
        error: null,
        success: null,
      });
    },
    // Token management methods - delegate to TokenService
    getSessionId: TokenService.getSessionId,
    getRefreshToken: TokenService.getRefreshToken,
    getToken: TokenService.getToken,
    getPairToken: TokenService.getPairToken,
    setUser: (user: AuthUser | null) => {
      set((state) => ({ ...state, user }));
    },
    setTokens: (
      accessToken: string,
      refreshToken: string,
      sessionId?: string
    ) => {
      TokenService.setTokens(accessToken, refreshToken, sessionId);
      // Update auth state
      set({ isAuthenticated: true, isInitialized: true });
    },
    removeSessionId: TokenService.removeSessionId,
    removeRefreshToken: TokenService.removeRefreshToken,
    removeToken: async () => {
      await TokenService.removeToken();
      // Also update auth state when token is removed
      set({ isAuthenticated: false, isInitialized: true });
    },
    /**
     * Process queued requests after token refresh
     */
    processQueue: (error: Error | null, token: string) => {
      const { failedQueue } = get();
      failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      });
      set({ failedQueue: [] });
    },
    /**
     * Refresh access token using refresh token
     * @returns Promise<string> New access token
     * @throws Error if refresh fails
     */
    refreshAccessToken: async (): Promise<string> => {
      const state = get();

      // If already refreshing, queue this request
      if (state.isRefreshing) {
        return new Promise((resolve, reject) => {
          set({
            failedQueue: [...state.failedQueue, { resolve, reject }],
          });
        });
      }

      set({ isRefreshing: true });

      try {
        const token = await TokenRefreshService.refreshAccessToken();
        // Update auth state
        set({ isAuthenticated: true, isInitialized: true });
        return token;
      } catch (error) {
        // Update auth state on refresh failure
        set({ isAuthenticated: false, isInitialized: true });
        throw error;
      } finally {
        set({ isRefreshing: false });
      }
    },
    reset: () =>
      set((state) => {
        TokenService.removeAllTokens();
        return {
          ...state,
          isAuthenticated: false,
          isInitialized: false,
          error: null,
          success: null,
          user: null,
          isRefreshing: false,
          failedQueue: [],
          auth: { ...state.auth, user: null },
        };
      }),
  },
}));
