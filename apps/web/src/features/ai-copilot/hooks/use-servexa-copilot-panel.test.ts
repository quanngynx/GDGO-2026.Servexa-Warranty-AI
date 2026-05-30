import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { useServexaCopilotPanel } from "./use-servexa-copilot-panel";

const mockAgent = {
  messages: [],
  addMessage: vi.fn(),
};

vi.mock("@copilotkit/react-core/v2", () => ({
  useAgentContext: vi.fn(),
  useConfigureSuggestions: vi.fn(),
  useCopilotKit: () => ({
    copilotkit: {
      waitForPendingFrameworkUpdates: vi.fn().mockResolvedValue(undefined),
      runAgent: vi.fn().mockResolvedValue(undefined),
    },
  }),
}));

vi.mock("./use-operational-context", () => ({
  useOperationalPageContext: () => ({
    currentRoute: "/",
    repairCaseId: null,
    caseNumber: null,
  }),
}));

vi.mock("./use-servexa-copilot-rail-metadata", () => ({
  useServexaCopilotRail: () => ({
    agent: mockAgent,
    railMeta: { pendingApprovals: [{ id: "rail-1" }] },
    isRunning: false,
    runError: null,
    clearRunError: vi.fn(),
  }),
}));

vi.mock("./use-hitl-requests", () => ({
  useHitlRequests: () => ({
    pending: [{ id: "hitl-1" }, { id: "rail-1" }],
    decided: [],
    isSubmitting: false,
    error: null,
    refresh: vi.fn(),
    createRequest: vi.fn(),
  }),
}));

vi.mock("./use-hitl-decision", () => ({
  useHitlDecision: () => ({
    isSubmitting: false,
    error: null,
    approve: vi.fn(),
    reject: vi.fn(),
    editAndApprove: vi.fn(),
    resumeGraph: vi.fn(),
  }),
}));

vi.mock("./use-hitl-pending-count", () => ({
  useHitlPendingCount: () => ({ count: 2 }),
}));

describe("useServexaCopilotPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("merges rail and API pending approvals without duplicates", () => {
    const { result } = renderHook(() => useServexaCopilotPanel("operations_intelligence"));

    expect(result.current.pendingApprovals).toHaveLength(2);
    expect(result.current.pendingApprovals.map((p) => p.id)).toEqual(
      expect.arrayContaining(["rail-1", "hitl-1"]),
    );
  });

  it("exposes handlers for chat and HITL flows", () => {
    const { result } = renderHook(() => useServexaCopilotPanel());

    expect(typeof result.current.handleRetryLast).toBe("function");
    expect(typeof result.current.handleApprove).toBe("function");
    expect(typeof result.current.handleCreateWorkflowRequest).toBe("function");
  });
});
