import { describe, expect, it } from "vitest";

import { normalizeLangGraphHitlMetadata } from "./normalize-unary";

describe("normalizeLangGraphHitlMetadata", () => {
  it("parses snake_case and camelCase interrupt fields", () => {
    const parsed = normalizeLangGraphHitlMetadata({
      human_approval_required: true,
      thread_id: "thread-1",
      checkpoint_id: "ck-1",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.threadId).toBe("thread-1");
      expect(parsed.data.humanApprovalRequired).toBe(true);
    }
  });
});
