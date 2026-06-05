/**
 * Smoke tests for public routes: liveness, API-key-protected root and deep health.
 */
import { describe, it, expect, vi, beforeAll } from "vitest";
import express, { type Express } from "express";
import http from "node:http";

import { publicRoutesRateLimiter } from "@/configs/rate-limit";
import { publicRoutesApiKeyMiddleware } from "@/middlewares/api-key.middleware";
import { errorHandler } from "@/middlewares/error-middleware";

vi.mock("@/core/infra/prisma", () => ({
  default: {
    $queryRaw: vi.fn().mockResolvedValue([{ "?column?": 1 }]),
  },
}));

vi.mock("@/core/infra/ioredis/redis-bootstrap", () => ({
  getBootstrapRedis: vi.fn().mockReturnValue({
    healthCheck: vi.fn().mockResolvedValue(true),
  }),
}));

function request(
  app: Express,
  method: string,
  path: string,
  headers: Record<string, string> = {},
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address() as { port: number };
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port,
          path,
          method,
          headers,
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on("data", (chunk) => chunks.push(chunk));
          res.on("end", () => {
            server.close();
            resolve({
              status: res.statusCode ?? 0,
              body: Buffer.concat(chunks).toString("utf8"),
            });
          });
        },
      );
      req.on("error", (err) => {
        server.close();
        reject(err);
      });
      req.end();
    });
  });
}

function createPublicRoutesApp(): Express {
  const app = express();
  const publicRateLimit = publicRoutesRateLimiter;

  app.get("/health", publicRateLimit, (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.get(
    "/health/deep",
    publicRateLimit,
    publicRoutesApiKeyMiddleware,
    async (_req, res) => {
      res.status(200).json({ status: "ok", db: true, redis: true });
    },
  );

  app.get("/", publicRateLimit, publicRoutesApiKeyMiddleware, (_req, res) => {
    res.status(200).send("OK");
  });

  app.use(errorHandler);
  return app;
}

describe("public routes integration", () => {
  let app: Express;

  beforeAll(() => {
    app = createPublicRoutesApp();
  });

  it("GET /health returns 200 without auth headers", async () => {
    const res = await request(app, "GET", "/health");
    expect(res.status).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ status: "ok" });
  });

  it("GET / returns 401 without x-api-key", async () => {
    const res = await request(app, "GET", "/");
    expect(res.status).toBe(401);
  });

  it("GET / returns 200 with valid x-api-key", async () => {
    const res = await request(app, "GET", "/", {
      "x-api-key": "vitest-public-routes-key",
    });
    expect(res.status).toBe(200);
    expect(res.body).toBe("OK");
  });

  it("GET /health/deep returns 401 without x-api-key", async () => {
    const res = await request(app, "GET", "/health/deep");
    expect(res.status).toBe(401);
  });

  it("GET /health/deep returns 200 with valid x-api-key", async () => {
    const res = await request(app, "GET", "/health/deep", {
      "x-api-key": "vitest-public-routes-key",
    });
    expect(res.status).toBe(200);
    expect(JSON.parse(res.body).status).toBe("ok");
  });
});
