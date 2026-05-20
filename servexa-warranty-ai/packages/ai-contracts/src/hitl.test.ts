import { describe, expect, it } from "vitest";

import {
  hitlDecisionSchema,
  hitlRequestSchema,
  isValidHitlStatusTransition,
} from "./hitl";

describe("hitl contracts", () => {
  it("validates a pending request", () => {
    const parsed = hitlRequestSchema.parse({
      id: "req-1",
      kind: "repair_escalation",
      title: "Escalate",
      description: "SLA risk",
      status: "pending",
      payload: { repairCaseId: "rc-1" },
      approvalOptions: [
        { id: "a", label: "Approve", decision: "approve" },
        { id: "r", label: "Reject", decision: "reject" },
      ],
      createdAt: new Date().toISOString(),
    });
    expect(parsed.status).toBe("pending");
  });

  it("enforces status transitions", () => {
    expect(isValidHitlStatusTransition("pending", "approved")).toBe(true);
    expect(isValidHitlStatusTransition("executed", "approved")).toBe(false);
    expect(isValidHitlStatusTransition("pending", "rejected")).toBe(true);
  });

  it("parses decisions", () => {
    const d = hitlDecisionSchema.parse({
      requestId: "req-1",
      decision: "edit",
      editedPayload: { reason: "updated" },
    });
    expect(d.decision).toBe("edit");
  });
});
