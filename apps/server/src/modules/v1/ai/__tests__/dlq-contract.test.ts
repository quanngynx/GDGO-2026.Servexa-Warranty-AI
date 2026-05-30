import { describe, expect, it } from "vitest";

import { aiJobDlqEnvelopeSchema } from "@servexa-warranty-ai/event-contracts";

describe("aiJobDlqEnvelopeSchema", () => {
  it("accepts Redis-style string retryCount (coerced)", () => {
    const parsed = aiJobDlqEnvelopeSchema.parse({
      version: "1.0",
      stream: "ai.analysis.stream",
      messageId: "1-0",
      reason: "invalid_json",
      retryCount: "0",
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    expect(parsed.retryCount).toBe(0);
  });
});
