/**
 * Minimal env for Vitest — runs when vitest.config loads, before test modules import `@servexa-warranty-ai/env`.
 * CI has no apps/server/.env; local runs can still override via .env.
 */
const testEnvDefaults: Record<string, string> = {
  NODE_ENV: "test",
  PORT: "3000",
  DATABASE_URL: "postgresql://ci:ci@127.0.0.1:5432/ci?schema=public",
  CORS_ORIGIN: "http://localhost:3001",
  CORS_ORIGIN_WEB: "http://localhost:3001",
  TEMP_REFRESH_TOKEN_SECRET: "vitest-refresh-token-secret",
};

for (const [key, value] of Object.entries(testEnvDefaults)) {
  const current = process.env[key];
  if (current === undefined || current.trim() === "") {
    process.env[key] = value;
  }
}
