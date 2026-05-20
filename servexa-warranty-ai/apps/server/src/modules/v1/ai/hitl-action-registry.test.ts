import { describe, expect, it } from "vitest";

import { getHitlHandler, isRegisteredHitlKind } from "./hitl-action-registry";

describe("hitl-action-registry", () => {
  it("registers phase-2 workflow kinds", () => {
    expect(isRegisteredHitlKind("repair_escalation")).toBe(true);
    expect(isRegisteredHitlKind("technician_assignment")).toBe(true);
    expect(isRegisteredHitlKind("customer_response_draft")).toBe(true);
    expect(isRegisteredHitlKind("unknown_kind" as "repair_escalation")).toBe(false);
  });

  it("rejects unknown kinds at runtime", () => {
    expect(() => getHitlHandler("part_order_request")).toThrow(/UNKNOWN_HITL_ACTION/);
  });
});
