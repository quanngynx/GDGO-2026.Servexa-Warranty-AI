import { KEY_COOKIE } from "@/constants";
import { TokenService } from "@/stores/services/service-auth";
import { getCookie } from "@servexa-warranty-ai/ui/lib/cookie";

/** Read auth cookies synchronously (CopilotKit must not mount with empty headers). */
export function getCopilotAuthHeadersSync(): Record<string, string> {
  const token = getCookie(KEY_COOKIE.AUTH_TOKEN);
  const userId = getCookie(KEY_COOKIE.AUTH_CLIENT_ID);
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (userId) {
    headers["x-client-id"] = userId;
  }
  return headers;
}

/** Headers required by server authenticateMiddleware for CopilotKit runtime. */
export async function getCopilotAuthHeaders(): Promise<Record<string, string>> {
  const token = await TokenService.getToken();
  const userId = getCookie(KEY_COOKIE.AUTH_CLIENT_ID);
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (userId) {
    headers["x-client-id"] = userId;
  }
  return headers;
}
