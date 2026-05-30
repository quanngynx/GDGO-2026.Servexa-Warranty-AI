import type { HitlDecision, HitlRequest } from "@servexa-warranty-ai/ai-contracts";
import { useCallback, useEffect, useState } from "react";

import {
  hitlApi,
  type CreateHitlRequestInput,
} from "@/libs/api/ai/hitl/api";

export type HitlState = {
  pending: HitlRequest[];
  decided: HitlRequest[];
  isSubmitting: boolean;
  error: string | null;
};

export function useHitlRequests() {
  const [pending, setPending] = useState<HitlRequest[]>([]);
  const [decided, setDecided] = useState<HitlRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const items = await hitlApi.listPending();
      setPending(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createRequest = useCallback(
    async (input: CreateHitlRequestInput): Promise<HitlRequest | null> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const created = await hitlApi.createRequest(input);
        setPending((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
        return created;
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const submitDecision = useCallback(
    async (
      requestId: string,
      decision: Omit<HitlDecision, "requestId">,
    ): Promise<HitlRequest | null> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const updated = await hitlApi.submitDecision(requestId, decision);
        setPending((prev) => prev.filter((p) => p.id !== requestId));
        if (updated.status !== "pending") {
          setDecided((prev) => [updated, ...prev.filter((d) => d.id !== requestId)]);
        }
        return updated;
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return {
    pending,
    decided,
    isSubmitting,
    error,
    refresh,
    createRequest,
    submitDecision,
  };
}
