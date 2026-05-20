import { describe, expect, it } from "vitest";

import { flattenCopilotContext } from "./flatten-copilot-context";

describe("flattenCopilotContext", () => {
  it("merges CopilotKit useAgentContext description/value entries", () => {
    const flat = flattenCopilotContext([
      {
        description: "Current Servexa UI context for warranty operations copilot",
        value: {
          repairCaseId: "uuid-12",
          caseNumber: "RC-2024-000012",
          repairCaseSnapshot: { customerName: "Nguyễn Văn An" },
        },
      },
      {
        description: "Latest HITL decision result for copilot continuation",
        value: { hitlRequestId: "", kind: "", status: "" },
      },
    ]);

    expect(flat.repairCaseId).toBe("uuid-12");
    expect(flat.caseNumber).toBe("RC-2024-000012");
    expect(flat.repairCaseSnapshot).toEqual({ customerName: "Nguyễn Văn An" });
    expect(flat.hitlRequestId).toBe("");
  });
});
