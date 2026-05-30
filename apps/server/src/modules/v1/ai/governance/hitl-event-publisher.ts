import { hitlEventEnvelopeSchema, type HitlEventEnvelope, type HitlEventType } from "@servexa-warranty-ai/event-contracts";

import { logger } from "@/core/logging";

/** Structured HITL lifecycle events (Redis fan-out can be added later). */
export function publishHitlEvent(
  event: HitlEventType,
  input: Omit<HitlEventEnvelope, "event" | "version" | "createdAt">,
): void {
  const envelope = hitlEventEnvelopeSchema.parse({
    version: "1.0",
    event,
    createdAt: new Date().toISOString(),
    ...input,
  });
  logger.info(`[hitl-event] ${envelope.event}`, envelope);
}
