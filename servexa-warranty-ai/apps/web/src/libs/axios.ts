import { useAuthStore } from "@/stores/auth-store";
import { TokenService } from "@/stores/services/service-auth";
import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type RawAxiosRequestConfig,
} from "axios";
import { qsStringify } from "@servexa-warranty-ai/ui/lib/qs";
import { env } from "@servexa-warranty-ai/env/web";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface AuthStore {
  getState: () => {
    getToken: () => string | null | undefined;
    refreshAccessToken: () => Promise<string>;
    logout: () => void;
  };
}

export abstract class BaseApi {
  readonly #instance: AxiosInstance;
  private authStore: AuthStore | null = null;

  // Use Queue to prevent Race Condition when refreshing token
  // private isRefreshing = false;
  // private failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

  constructor(config?: RawAxiosRequestConfig) {
    this.#instance = axios.create({
      baseURL: `${env.VITE_SERVER_URL}/api`,
      timeout: 15_000,
      paramsSerializer: {
        serialize: (params) => qsStringify(params, "comma"),
      },
      ...config,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.#instance.interceptors.request.use(
      async (config) => {
        // Get token from Cookie (via TokenService) to ensure latest data
        const token = await TokenService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.#instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Call directly from Store: Zustand will handle the queueing
            const newToken = await useAuthStore
              .getState()
              .auth.refreshAccessToken();

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.#instance(originalRequest);
          } catch (refreshError) {
            useAuthStore.getState().auth.logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public setAuthStore(store: AuthStore): void {
    this.authStore = store;
  }

  // --- Helper functions ---

  protected async tryGet<T>(
    url: string,
    config?: RawAxiosRequestConfig
  ): Promise<T | null> {
    const res = await this.#instance.get<T>(url, config);
    return res?.data ?? null;
  }

  protected async tryPost<TReturn, TBody = any>(
    url: string,
    data: TBody,
    config?: RawAxiosRequestConfig
  ): Promise<TReturn | null> {
    const isFormData = data instanceof FormData;
    const res = isFormData
      ? await this.#instance.postForm<TReturn>(url, data, config)
      : await this.#instance.post<TReturn>(url, data, config);
    return res?.data ?? null;
  }

  protected async tryPut<TReturn, TBody = any>(
    url: string,
    data: TBody,
    config?: RawAxiosRequestConfig
  ): Promise<TReturn | null> {
    const res =
      data instanceof FormData
        ? await this.#instance.putForm<TReturn>(url, data, config)
        : await this.#instance.put<TReturn>(url, data, config);
    return res?.data ?? null;
  }

  protected async tryDelete<TReturn>(
    url: string,
    config?: RawAxiosRequestConfig
  ): Promise<TReturn | null> {
    const res = await this.#instance.delete<TReturn>(url, config);
    return res?.data ?? null;
  }
}
