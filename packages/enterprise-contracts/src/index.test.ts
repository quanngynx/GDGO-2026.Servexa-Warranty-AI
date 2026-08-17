import { describe, expect, it } from "vitest";
import {
  aiProviderRequestSchema,
  enterprisePrincipalSchema,
  executeWarrantyDecisionCommandSchema,
  ReferenceWarrantySystemAdapter,
  warrantyExecutionIdempotencyKey,
} from "./index";

const trace = {
  correlationId: "p0a-proof-1",
  traceparent: "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
};

describe("enterprise contracts", () => {
  it("derives a stable external idempotency key", () => {
    expect(warrantyExecutionIdempotencyKey("wf-1", 3)).toBe("wf-1:3");
  });

  it("accepts an ASC-scoped active principal", () => {
    expect(enterprisePrincipalSchema.parse({
      subject: "operator-1",
      email: "operator@example.invalid",
      displayName: "Synthetic Operator",
      groups: ["asc-operators"],
      ascIds: ["ASC-HCM-01"],
      active: true,
    }).ascIds).toEqual(["ASC-HCM-01"]);
  });

  it("rejects unclassified or extra AI provider data", () => {
    expect(() => aiProviderRequestSchema.parse({
      requestId: "ai-1",
      task: "GENERATE",
      sanitizedInput: "synthetic policy excerpt",
      dataClasses: ["RESTRICTED"],
      trace,
      customerPhone: "0900000000",
    })).toThrow();
  });

  it("requires an optimistic case version for execution", () => {
    expect(() => executeWarrantyDecisionCommandSchema.parse({
      workflowId: "wf-1",
      decisionVersion: 1,
      externalCaseId: "case-1",
      outcome: "ELIGIBLE",
      decidedBy: "manager-1",
      trace,
    })).toThrow();
  });

  it("maps reference adapter failures into the shared taxonomy", async () => {
    const fetchImpl = async () => new Response(JSON.stringify({ ok: false, error: { code: "UNAVAILABLE", message: "synthetic outage", retryable: true, correlationId: "p0a-proof-1" } }), { status: 503, headers: { "content-type": "application/json" } });
    const adapter = new ReferenceWarrantySystemAdapter("http://reference.invalid", fetchImpl as typeof fetch);
    await expect(adapter.getCaseContext("case-1", trace)).rejects.toMatchObject({ code: "UNAVAILABLE", retryable: true, correlationId: "p0a-proof-1" });
  });

  it("sends a stable idempotency key through the reference adapter", async () => {
    let observedKey: string | null = null;
    const fetchImpl = async (_input: string | URL | Request, init?: RequestInit) => {
      observedKey = new Headers(init?.headers).get("idempotency-key");
      return new Response(JSON.stringify({ externalExecutionId: "external-1", idempotencyKey: "wf-1:3", status: "ACCEPTED" }), { status: 200, headers: { "content-type": "application/json" } });
    };
    const adapter = new ReferenceWarrantySystemAdapter("http://reference.invalid", fetchImpl as typeof fetch);
    await adapter.executeWarrantyDecision({ workflowId: "wf-1", decisionVersion: 3, externalCaseId: "case-1", expectedCaseVersion: "v1", outcome: "ELIGIBLE", decidedBy: "manager-1", trace });
    expect(observedKey).toBe("wf-1:3");
  });
});
