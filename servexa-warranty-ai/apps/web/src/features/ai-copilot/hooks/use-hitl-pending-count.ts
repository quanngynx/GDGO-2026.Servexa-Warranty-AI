import { useHitlRequests } from "./use-hitl-requests";

export function useHitlPendingCount() {
  const { pending, refresh, isSubmitting, error } = useHitlRequests();
  return {
    count: pending.length,
    pending,
    refresh,
    isSubmitting,
    error,
  };
}
