import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { useHitlDecision } from "./use-hitl-decision";

vi.mock("@/libs/api/ai/hitl/api", () => ({
  hitlApi: {
    submitDecision: vi.fn().mockResolvedValue({ id: "req-1", status: "approved" }),
    resumeRequest: vi.fn().mockResolvedValue({ request: { id: "req-1" } }),
  },
}));

import { hitlApi } from "@/libs/api/ai/hitl/api";

describe("useHitlDecision", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("approve calls submitDecision", async () => {
    const { result } = renderHook(() => useHitlDecision());

    await act(async () => {
      await result.current.approve("req-1");
    });

    expect(hitlApi.submitDecision).toHaveBeenCalledWith("req-1", { decision: "approve" });
    expect(result.current.isSubmitting).toBe(false);
  });

  it("reject sets error on failure", async () => {
    vi.mocked(hitlApi.submitDecision).mockRejectedValueOnce(new Error("network"));
    const { result } = renderHook(() => useHitlDecision());

    await act(async () => {
      await result.current.reject("req-1", "no");
    });

    expect(result.current.error).toBe("network");
  });
});
