import { describe, expect, it } from "vitest";

import {
  copilotRailMetadataSchema,
  diagnosisDraftSchema,
  selectedCaseSummarySchema,
  warrantyEligibilitySchema,
  workflowProgressSchema,
} from "./copilot-response";
import {
  buildHeuristicDiagnosisDraft,
  parseDiagnosisDraft,
  parseSelectedCaseSummaryFromExecutionContext,
} from "./copilot-shared-state";

describe("copilot Phase 3 schemas", () => {
  it("parses selectedCaseSummary", () => {
    const parsed = selectedCaseSummarySchema.parse({
      repairCaseId: "rc-1",
      caseNumber: "CASE-001",
      status: "open",
    });
    expect(parsed.repairCaseId).toBe("rc-1");
  });

  it("parses warrantyEligibility enums", () => {
    const parsed = warrantyEligibilitySchema.parse({
      status: "eligible",
      reason: "Active warranty",
      confidence: 0.8,
    });
    expect(parsed.status).toBe("eligible");
  });

  it("rejects invalid warranty status", () => {
    const result = warrantyEligibilitySchema.safeParse({
      status: "maybe",
      reason: "x",
    });
    expect(result.success).toBe(false);
  });

  it("parses diagnosisDraft with defaults", () => {
    const parsed = diagnosisDraftSchema.parse({
      severity: "high",
    });
    expect(parsed.symptoms).toEqual([]);
    expect(parsed.severity).toBe("high");
  });

  it("parses workflowProgress", () => {
    const parsed = workflowProgressSchema.parse({
      currentStep: "awaiting_approval",
      steps: [{ key: "case_selected", label: "Case selected", status: "done" }],
    });
    expect(parsed.steps).toHaveLength(1);
  });

  it("keeps legacy rail metadata valid without Phase 3 fields", () => {
    const parsed = copilotRailMetadataSchema.parse({
      confidence: 0.9,
      suggestedActions: [
        {
          id: "a1",
          label: "Ask",
          action: "prompt:hello",
        },
      ],
    });
    expect(parsed.selectedCaseSummary).toBeUndefined();
  });

  it("parses selectedCaseSummary from execution context flatten shape", () => {
    const summary = parseSelectedCaseSummaryFromExecutionContext({
      repairCaseId: "rc-99",
      repairCaseSnapshot: {
        caseNumber: "C-99",
        errorPhenomena: "No power",
        productModel: "Phone X",
      },
    });
    expect(summary?.repairCaseId).toBe("rc-99");
    expect(summary?.errorPhenomena).toBe("No power");
  });

  it("builds heuristic diagnosis from snapshot", () => {
    const draft = buildHeuristicDiagnosisDraft({
      errorPhenomena: "Screen flicker",
      productModel: "Tablet",
      serialNumber: "SN-1",
    });
    expect(draft.symptoms[0]).toContain("Screen flicker");
    expect(parseDiagnosisDraft(draft)).toBeDefined();
  });
});
