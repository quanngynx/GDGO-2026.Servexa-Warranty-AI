import { logger } from "@/core/logging";

/** Structured governance / audit events for tools and AI actions. */
export function logAiAuditEvent(event: string, payload: Record<string, unknown>): void {
  logger.info(`[ai-governance] ${event}`, payload);
}
