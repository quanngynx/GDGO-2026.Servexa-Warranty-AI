import type { HitlDecision, HitlRequest, HitlResumeResponse } from "@servexa-warranty-ai/ai-contracts";

import { BaseApi } from "@/libs/axios";

import type { BaseApiResponse } from "../../bases/base-response";

export type CreateHitlRequestInput = {
  kind: HitlRequest["kind"];
  title: string;
  description: string;
  payload: Record<string, unknown>;
  evidenceSourceIds?: string[];
  confidence?: number;
  riskLevel?: HitlRequest["riskLevel"];
};

class HitlApi extends BaseApi {
  async listPending(scope: "mine" | "asc" | "all" = "asc"): Promise<HitlRequest[]> {
    const res = await this.tryGet<BaseApiResponse<{ items: HitlRequest[] }>>(
      "/v1/ai/hitl/requests",
      { params: { status: "pending", scope } },
    );
    return res?.metadata.items ?? [];
  }

  async createRequest(body: CreateHitlRequestInput): Promise<HitlRequest> {
    const res = await this.tryPost<BaseApiResponse<HitlRequest>, CreateHitlRequestInput>(
      "/v1/ai/hitl/requests",
      body,
    );
    if (!res?.metadata) throw new Error("Failed to create HITL request");
    return res.metadata;
  }

  async getRequest(id: string): Promise<HitlRequest> {
    const res = await this.tryGet<BaseApiResponse<HitlRequest>>(
      `/v1/ai/hitl/requests/${id}`,
    );
    if (!res?.metadata) throw new Error("HITL request not found");
    return res.metadata;
  }

  async submitDecision(
    id: string,
    decision: Omit<HitlDecision, "requestId">,
  ): Promise<HitlRequest> {
    const res = await this.tryPost<
      BaseApiResponse<HitlRequest>,
      Omit<HitlDecision, "requestId">
    >(`/v1/ai/hitl/requests/${id}/decision`, decision);
    if (!res?.metadata) throw new Error("Failed to submit HITL decision");
    return res.metadata;
  }

  async resumeRequest(id: string): Promise<HitlResumeResponse> {
    const res = await this.tryPost<BaseApiResponse<HitlResumeResponse>, Record<string, never>>(
      `/v1/ai/hitl/requests/${id}/resume`,
      {},
    );
    if (!res?.metadata) throw new Error("Failed to resume LangGraph workflow");
    return res.metadata;
  }
}

export const hitlApi = new HitlApi();
