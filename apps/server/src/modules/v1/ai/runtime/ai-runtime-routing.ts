import type { AiJobType } from "@/modules/v1/ai/schemas/ai-request.schema";

/**
 * Workloads that MUST go through the async Redis → worker path (see docs/architecture/AI_RUNTIME.md#ai-runtime-policy).
 */
const ASYNC_ONLY_JOB_TYPES = new Set<AiJobType>([
  "report_generation",
  "summarization",
  "anomaly_detection",
  "knowledge_ingest",
]);

/**
 * Returns true when this job type must not be executed synchronously as a substitute for a failed gRPC call.
 */
export function jobTypeRequiresAsyncRuntime(type: AiJobType): boolean {
  return ASYNC_ONLY_JOB_TYPES.has(type);
}

/**
 * Heuristic: long user text should prefer async even for `analysis` / `chat_followup`.
 */
export function promptLikelyRequiresAsync(query: string): boolean {
  const q = query.trim();
  return q.length > 12_000;
}
