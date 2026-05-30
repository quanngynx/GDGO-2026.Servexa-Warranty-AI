import { env } from "@servexa-warranty-ai/env/server";

import { logger } from "@/core/logging";

/**
 * Hook for OpenTelemetry / vendor exporters. Install SDK packages before enabling `OTEL_ENABLED`.
 */
export async function initServerTelemetry(): Promise<void> {
  if (!env.OTEL_ENABLED) {
    return;
  }
  logger.info(
    "[telemetry] OTEL_ENABLED=true — register NodeSDK + instrumentations here (see OpenTelemetry JS docs).",
  );
}

export function describeLangfuseConfig(): void {
  if (!env.LANGFUSE_PUBLIC_KEY && !env.LANGFUSE_SECRET_KEY) {
    return;
  }
  logger.info("[telemetry] Langfuse keys present — wire AI SDK experimental_telemetry when ready.", {
    host: env.LANGFUSE_HOST ?? "https://cloud.langfuse.com",
  });
}
