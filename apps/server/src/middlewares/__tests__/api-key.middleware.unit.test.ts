import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { publicRoutesApiKeyMiddleware } from "@/middlewares/api-key.middleware";
import type { OperationalError } from "@/middlewares/error-middleware";

const mockEnv = vi.hoisted(() => ({
  PUBLIC_ROUTES_API_KEY: "test-public-routes-key" as string | undefined,
  NODE_ENV: "test" as "test" | "development" | "production",
}));

vi.mock("@servexa-warranty-ai/env/server", () => ({
  env: mockEnv,
}));

function runMiddleware(
  headers: Record<string, string | undefined> = {},
): { req: Request; next: ReturnType<typeof vi.fn> } {
  const req = { headers } as Request;
  const res = {} as Response;
  const next = vi.fn();
  publicRoutesApiKeyMiddleware(req, res, next);
  return { req, next };
}

describe("publicRoutesApiKeyMiddleware", () => {
  beforeEach(() => {
    mockEnv.PUBLIC_ROUTES_API_KEY = "test-public-routes-key";
    mockEnv.NODE_ENV = "test";
  });

  it("rejects when x-api-key header is missing", () => {
    const { next } = runMiddleware();
    expect(next).toHaveBeenCalledOnce();
    const error = next.mock.calls[0]![0] as OperationalError;
    expect(error.statusCode).toBe(HTTP_RESPONSE_CODE.UNAUTHORIZED);
  });

  it("rejects when x-api-key does not match configured secret", () => {
    const { next } = runMiddleware({ "x-api-key": "wrong-key" });
    expect(next).toHaveBeenCalledOnce();
    const error = next.mock.calls[0]![0] as OperationalError;
    expect(error.statusCode).toBe(HTTP_RESPONSE_CODE.UNAUTHORIZED);
  });

  it("accepts a valid x-api-key and sets request apiKey metadata", () => {
    const { req, next } = runMiddleware({
      "x-api-key": "test-public-routes-key",
    });
    expect(next).toHaveBeenCalledOnce();
    expect(next.mock.calls[0]![0]).toBeUndefined();
    expect(req.apiKey).toEqual({
      keyId: "public-routes",
      owner: "system",
      scopes: ["public"],
    });
  });

  it("returns 503 in production when PUBLIC_ROUTES_API_KEY is not configured", () => {
    mockEnv.PUBLIC_ROUTES_API_KEY = undefined;
    mockEnv.NODE_ENV = "production";

    const { next } = runMiddleware({ "x-api-key": "any" });
    const error = next.mock.calls[0]![0] as OperationalError;
    expect(error.statusCode).toBe(HTTP_RESPONSE_CODE.SERVICE_UNAVAILABLE);
  });
});
