import { clearCookie, getCookie, setCookie } from "@servexa-warranty-ai/ui/lib/cookie";

import { KEY_COOKIE } from "@/constants";
import axios from "axios";
import { env } from "@servexa-warranty-ai/env/web";
import { authAPI } from "@/libs/api/auth/api";
import type { ResponseLoginDto } from "@/libs/api/auth/data-transfer-object";

export class AuthService {
  /**
   * Checks if user is authenticated by checking for token in cookies
   */
  static isAuthenticated(): boolean {
    const token = getCookie(KEY_COOKIE.AUTH_TOKEN);
    return !!token;
  }

  /**
   * Authenticates a user by logging in with their email and password
   */
  static async login(
    username: string,
    password: string
  ): Promise<{
    success: boolean;
    data?: ResponseLoginDto;
    error?: string;
  }> {
    try {
      const response = await authAPI.login(username, password);

      if (!response) {
        return {
          success: false,
          error: "Invalid username or password. Please try again.",
        };
      }

      const { token } = response.data;
      TokenService.setToken(token);
      console.log(
        "Login successful, token set in cookies:",
        KEY_COOKIE.AUTH_TOKEN
      );

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error:
          "An unexpected error occurred. Please try again." +
          (error instanceof Error ? `: ${error.message}` : ""),
      };
    }
  }

  /**
   * Logs out the current user by removing tokens
   */
  static logout(): void {
    TokenService.removeAllTokens();
  }

  /**
   * Initializes authentication state based on stored tokens
   */
  static initializeAuth(): {
    isAuthenticated: boolean;
    hasToken: boolean;
  } {
    const token = getCookie(KEY_COOKIE.AUTH_TOKEN);
    const isAuthenticated = !!token;

    if (isAuthenticated) {
      console.log("User is already authenticated");
    } else {
      console.log("User is not authenticated");
    }

    return {
      isAuthenticated,
      hasToken: !!token,
    };
  }
}

export class TokenService {
  /**
   * Get session ID from cookies
   */
  static async getSessionId(): Promise<string | undefined> {
    return getCookie(KEY_COOKIE.SESSION_ID) ?? undefined;
  }

  /**
   * Get refresh token from cookies
   */
  static async getRefreshToken(): Promise<string | undefined> {
    return getCookie(KEY_COOKIE.REFRESH_TOKEN) ?? undefined;
  }

  /**
   * Get access token from cookies
   */
  static async getToken(): Promise<string | undefined> {
    return getCookie(KEY_COOKIE.AUTH_TOKEN) ?? undefined;
  }

  /**
   * Get both tokens as a pair
   */
  static async getPairToken(): Promise<{
    refreshToken: string | undefined;
    token: string | undefined;
  }> {
    return {
      refreshToken: getCookie(KEY_COOKIE.REFRESH_TOKEN) ?? undefined,
      token: getCookie(KEY_COOKIE.AUTH_TOKEN) ?? undefined,
    };
  }

  /**
   * Set access token in cookies
   */
  static setToken(accessToken: string): void {
    setCookie(KEY_COOKIE.AUTH_TOKEN, accessToken, env.VITE_SERVER_URL, 7);
  }

  /**
   * Set all tokens in cookies
   */
  static setTokens(
    accessToken: string,
    refreshToken: string,
    sessionId?: string
  ): void {
    setCookie(KEY_COOKIE.AUTH_TOKEN, accessToken, env.VITE_SERVER_URL, 7);
    setCookie(KEY_COOKIE.REFRESH_TOKEN, refreshToken, env.VITE_SERVER_URL, 7);
    if (sessionId) {
      setCookie(KEY_COOKIE.SESSION_ID, sessionId, env.VITE_SERVER_URL, 7);
    }
  }

  /**
   * Remove session ID from cookies
   */
  static async removeSessionId(): Promise<void> {
    clearCookie(KEY_COOKIE.SESSION_ID, env.VITE_SERVER_URL);
  }

  /**
   * Remove refresh token from cookies
   */
  static async removeRefreshToken(): Promise<void> {
    clearCookie(KEY_COOKIE.REFRESH_TOKEN, env.VITE_SERVER_URL);
  }

  /**
   * Remove access token from cookies
   */
  static async removeToken(): Promise<void> {
    clearCookie(KEY_COOKIE.AUTH_TOKEN, env.VITE_SERVER_URL);
  }

  /**
   * Remove all tokens from cookies
   */
  static removeAllTokens(): void {
    clearCookie(KEY_COOKIE.AUTH_TOKEN, env.VITE_SERVER_URL);
    clearCookie(KEY_COOKIE.REFRESH_TOKEN, env.VITE_SERVER_URL);
    clearCookie(KEY_COOKIE.SESSION_ID, env.VITE_SERVER_URL);
  }
}

export class TokenRefreshService {
  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(): Promise<string> {
    const refreshToken = await TokenService.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");

    const response = await axios.post("/api/auth/refresh", { refreshToken });
    const { accessToken, refreshToken: newRefresh, sessionId } = response.data;

    TokenService.setTokens(accessToken, newRefresh, sessionId);
    return accessToken;
  }
}
