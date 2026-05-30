import type { ReasoningTrace, ReasoningTraceEvent } from "@servexa-warranty-ai/ai-contracts";

import { BaseApi } from "@/libs/axios";

import type { BaseApiResponse } from "../../bases/base-response";

class ReasoningTraceApi extends BaseApi {
  async getTrace(traceId: string): Promise<ReasoningTrace> {
    const res = await this.tryGet<BaseApiResponse<ReasoningTrace>>(
      `/v1/ai/reasoning-traces/${traceId}`,
    );
    if (!res?.metadata) throw new Error("Reasoning trace not found");
    return res.metadata;
  }

  async listEvents(traceId: string): Promise<ReasoningTraceEvent[]> {
    const res = await this.tryGet<BaseApiResponse<{ items: ReasoningTraceEvent[] }>>(
      `/v1/ai/reasoning-traces/${traceId}/events`,
    );
    return res?.metadata.items ?? [];
  }

  async listByRepairCase(repairCaseId: string): Promise<ReasoningTrace[]> {
    const res = await this.tryGet<BaseApiResponse<{ items: ReasoningTrace[] }>>(
      "/v1/ai/reasoning-traces",
      { params: { repairCaseId } },
    );
    return res?.metadata.items ?? [];
  }
}

export const reasoningTraceApi = new ReasoningTraceApi();
