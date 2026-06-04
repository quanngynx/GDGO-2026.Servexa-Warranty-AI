import { describe, it, expect } from "vitest";
import { reasoningTraceStreamEventSchema } from "@servexa-warranty-ai/event-contracts";

describe("reasoningTraceStreamEventSchema", () => {
  it("accepts a valid reasoning stream event", () => {
    const parsed = reasoningTraceStreamEventSchema.safeParse({
      event: "reasoning.step.delta",
      traceId: "trace-1",
      runId: "run-1",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects malformed events missing traceId", () => {
    const parsed = reasoningTraceStreamEventSchema.safeParse({
      event: "reasoning.step.delta",
      runId: "run-1",
    });
    expect(parsed.success).toBe(false);
  });
});
