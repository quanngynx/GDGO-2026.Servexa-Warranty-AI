import { env } from "@servexa-warranty-ai/env/web";
import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Cookie Domain must be a hostname; `VITE_SERVER_URL` is a full URL and breaks Set-Cookie. */
export function getAuthCookieDomain(): string {
  if (typeof window !== 'undefined' && window.location.hostname) {
    return window.location.hostname
  }
  try {
    return new URL(env.VITE_SERVER_URL).hostname
  } catch {
    return 'localhost'
  }
}

export function mapLoginError(error: unknown): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status
    const rawMessage =
      typeof error.response?.data === 'object' &&
      error.response.data !== null &&
      'message' in error.response.data
        ? String(
            (error.response.data as { message?: unknown }).message ?? '',
          )
        : ''

    if (status === 403) {
      return 'Account suspended'
    }
    if (
      rawMessage.includes('Authentication') ||
      status === 401
    ) {
      return 'Incorrect username or password'
    }
    if (rawMessage) {
      return rawMessage
    }
  }
  return 'An unexpected error occurred. Please try again.'
}