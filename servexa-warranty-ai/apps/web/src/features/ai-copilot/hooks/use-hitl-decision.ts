import type { HitlDecision, HitlRequest } from "@servexa-warranty-ai/ai-contracts";
import { useCallback, useState } from "react";

import { hitlApi } from "@/libs/api/ai/hitl/api";

export function useHitlDecision() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitDecision = useCallback(
    async (
      requestId: string,
      decision: Omit<HitlDecision, "requestId">,
    ): Promise<HitlRequest | null> => {
      setIsSubmitting(true);
      setError(null);
      try {
        return await hitlApi.submitDecision(requestId, decision);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const approve = useCallback(
    (requestId: string) => submitDecision(requestId, { decision: "approve" }),
    [submitDecision],
  );

  const reject = useCallback(
    (requestId: string, reason?: string) =>
      submitDecision(requestId, { decision: "reject", reason }),
    [submitDecision],
  );

  const editAndApprove = useCallback(
    async (
      requestId: string,
      editedPayload: Record<string, unknown>,
      reason?: string,
    ) => {
      const edited = await submitDecision(requestId, {
        decision: "edit",
        editedPayload,
        reason,
      });
      if (edited?.status !== "edited") return edited;
      return submitDecision(requestId, { decision: "approve" });
    },
    [submitDecision],
  );

  const resumeGraph = useCallback(async (requestId: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await hitlApi.resumeRequest(requestId);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    isSubmitting,
    error,
    submitDecision,
    approve,
    reject,
    editAndApprove,
    resumeGraph,
  };
}
