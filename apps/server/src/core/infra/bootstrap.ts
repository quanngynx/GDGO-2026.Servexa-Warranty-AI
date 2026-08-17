import compression from "compression";
import cors from "cors";
import express, {
  json,
  type Request,
  type Response,
  urlencoded,
} from "express";
import helmet from "helmet";
import { env } from "@servexa-warranty-ai/env/server";
import { ErrorHandler } from "../helpers/error-handling.helper";
import { errorHandler } from "@/middlewares/error-middleware";
import mainRouter from "@/routes";
import path from "path";

import prisma from "@/core/infra/prisma";
import {
  connectBootstrapRedis,
  getBootstrapRedis,
} from "@/core/infra/ioredis/redis-bootstrap";
import { logger } from "../logging";
import { corsOptions } from "@/configs/cors";
import {
  requestContextMiddleware,
  requestLoggingMiddleware,
  userContextMiddleware,
} from "@/middlewares";
import { handleBootstrapAiChat } from "@/modules/v1/ai/helpers/bootstrap-ai-chat.helper";
import { createCopilotKitRouter } from "@/modules/copilotkit/copilot-runtime.router";
import { helmetConfig } from "@/configs/helmet";
import { publicRoutesRateLimiter } from "@/configs/rate-limit";
import { describeLangfuseConfig, initServerTelemetry } from "@/core/observability/telemetry";
import { uploadDir } from "@/configs/upload-dir";
import { publicRoutesApiKeyMiddleware } from "@/middlewares/api-key.middleware";
import { randomBytes } from "node:crypto";

function p0aTraceId(traceparent: string): string {
  return traceparent.split("-")[1] ?? randomBytes(16).toString("hex");
}

async function emitP0aSpan(traceparent: string, correlationId: string, name: string): Promise<void> {
  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (process.env.P0A_ENABLED !== "true" || !endpoint) return;
  const start = BigInt(Date.now()) * 1_000_000n;
  const response = await fetch(`${endpoint.replace(/\/$/, "")}/v1/traces`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ resourceSpans: [{
      resource: { attributes: [{ key: "service.name", value: { stringValue: "servexa-server-p0a" } }] },
      scopeSpans: [{ scope: { name: "p0a-proof" }, spans: [{
        traceId: p0aTraceId(traceparent), spanId: randomBytes(8).toString("hex"), name, kind: 2,
        startTimeUnixNano: String(start), endTimeUnixNano: String(start + 1_000_000n), status: { code: 1 },
        attributes: [{ key: "correlation.id", value: { stringValue: correlationId } }],
      }] }],
    }] }),
  });
  if (!response.ok) throw new Error(`P0A OTLP export failed: ${response.status}`);
}

export class AppBootStrap {
  public app: express.Express = express();

  public async bootstrap() {
    this.configProxy();
    this.initializeMiddlewares();
    void this.initializeServices();
    this.initializeRoutes();
    this.initializeErrorHandling();
    await this.handleUploadDirectories();
  }

  private configProxy() {
    this.app.set("trust proxy", true); // to Express knows that header X-Forwarded-* is from proxy
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet(helmetConfig));
    this.app.use(cors(corsOptions));

    // Compression and body parsing
    this.app.use(compression());
    this.app.use(json({ limit: "10mb" }));
    this.app.use(urlencoded({ extended: true, limit: "10mb" }));

    // Request context and logging middleware
    this.app.use(requestContextMiddleware);
    this.app.use(userContextMiddleware);
    this.app.use(requestLoggingMiddleware);
  }

  private async initializeServices(): Promise<void> {
    await initServerTelemetry();
    describeLangfuseConfig();
    await prisma.$connect();
    logger.info(`[${env.BRANDING_NAME}] Database connected successfully`);

    try {
      await connectBootstrapRedis();
      logger.info(`[${env.BRANDING_NAME}] Redis connected successfully`);

      // Start export worker in-process so it runs in dev & prod single-server mode.
      // In production scale-out, disable this and run export-worker.bootstrap separately.
      const { startProductExportWorker } = await import(
        '@/modules/v1/product-catalog/workers/product-export.worker'
      );
      startProductExportWorker().catch((err: unknown) => {
        logger.error(`[${env.BRANDING_NAME}] Export worker crashed`, { err });
      });
      logger.info(`[${env.BRANDING_NAME}] Product export worker started`);
    } catch (error) {
      logger.error(`[${env.BRANDING_NAME}] Redis connection failed`, {
        error: error instanceof Error ? error.message : String(error),
      });
      if (env.NODE_ENV === "production") {
        throw error;
      }
    }
  }

  private initializeRoutes(): void {
    const publicRateLimit = publicRoutesRateLimiter;

    this.app.get("/health", publicRateLimit, (_req, res) => {
      res.status(200).json({ status: "ok" });
    });

    this.app.get("/ready", publicRateLimit, async (_req, res) => {
      const configuredDependencies = (process.env.P0A_DEPENDENCY_URLS ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      const dependencies = await Promise.all(
        configuredDependencies.map(async (url) => {
          try {
            const response = await fetch(url, { signal: AbortSignal.timeout(2_000) });
            return { url, ready: response.ok };
          } catch {
            return { url, ready: false };
          }
        }),
      );
      const ready = dependencies.every((dependency) => dependency.ready);
      res.status(ready ? 200 : 503).json({
        status: ready ? "ready" : "degraded",
        dependencies,
        timestamp: new Date().toISOString(),
      });
    });

    if (process.env.P0A_ENABLED === "true") {
      this.app.post("/api/p0a/trace-proof", async (req, res, next) => {
        try {
          const traceparent = req.traceparent;
          if (!traceparent) return res.status(400).json({ error: "traceparent required" });
          const correlationId = req.requestId;
          await emitP0aSpan(traceparent, correlationId, "express-p0a-proof");
          const aiResponse = await fetch(`${process.env.P0A_AI_API_URL}/v1/health/p0a-trace-proof`, {
            method: "POST",
            headers: { traceparent, "x-correlation-id": correlationId },
          });
          if (!aiResponse.ok) throw new Error(`FastAPI P0A trace failed: ${aiResponse.status}`);
          const redis = getBootstrapRedis();
          if (!redis) throw new Error("Redis is unavailable for P0A trace proof");
          await redis.getClient().xadd("p0a:trace", "*", "traceparent", traceparent, "correlationId", correlationId);
          res.status(202).json({ traceparent, correlationId, fastApi: await aiResponse.json() });
        } catch (error) {
          next(error);
        }
      });
    }

    this.app.get(
      "/health/deep",
      publicRateLimit,
      publicRoutesApiKeyMiddleware,
      async (_req, res) => {
        let dbOk = false;
        try {
          await prisma.$queryRaw`SELECT 1`;
          dbOk = true;
        } catch {
          dbOk = false;
        }

        const redis = getBootstrapRedis();
        const redisOk = redis ? await redis.healthCheck() : false;
        const redisRequired = env.NODE_ENV === "production";
        const ok = dbOk && (!redisRequired || redisOk);

        res.status(ok ? 200 : 503).json({
          status: ok ? "ok" : "degraded",
          db: dbOk,
          redis: redisOk,
          timestamp: new Date().toISOString(),
        });
      },
    );

    this.app.get(
      "/",
      publicRateLimit,
      publicRoutesApiKeyMiddleware,
      (_req: Request, res: Response) => {
        res.status(200).send("OK");
      },
    );

    this.app.use("/uploads", express.static(path.join(process.cwd(), "uploads"), { maxAge: "30d" }));

    this.app.use(mainRouter);
    this.app.use("/api/copilotkit", createCopilotKitRouter());

    this.app.post("/ai", handleBootstrapAiChat);

    this.app.use((_req, res) => {
      res.status(404).json({ message: "Not found" });
    });
  }

  private initializeErrorHandling(): void {
    // automatically report unhandled errors along with the request data
    // The error handler must be before any other error middleware and after all controllers
    this.app.use(errorHandler);
  }

  private async handleUploadDirectories() {
    await import('fs')
      .then((fs) => {
        uploadDir.forEach((dir) => {
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(
              `[${env.NODE_ENV}] - AppBootstrap - Created upload directory: ${dir}`,
            );
          }
        });
      })
      .catch((error) => {
        console.error(
          `[${env.NODE_ENV}] - AppBootstrap - Error creating upload directories`,
          error,
        );
      });
  }

  public listen(port: number): void {
    const server = this.app.listen(port, () => {
      console.log(`[${env.BRANDING_NAME}] Server running on port ${port}`);
    });

    // Handle port conflicts with clear error message
    server.on("error", (error: NodeJS.ErrnoException) => {
      console.error(`[${env.BRANDING_NAME}] Server error:`, error);
      if (error.code === "EADDRINUSE") {
        console.error(`[${env.BRANDING_NAME}] Port ${port} is already in use.`);
        console.error(
          `[${env.BRANDING_NAME}] Please stop the existing server or kill the process using:`,
        );
        console.error(
          `[${env.BRANDING_NAME}]   netstat -ano | findstr :${port}`,
        );
        console.error(`[${env.BRANDING_NAME}]   taskkill /PID <PID_NUMBER> /F`);
        process.exit(1);
      } else {
        console.error(`[${env.BRANDING_NAME}] Server error:`, error);
        process.exit(1);
      }
    });

    // Initialize error handlers with server instance
    ErrorHandler.getInstance().initialize(server);
  }
}
