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
import { describeLangfuseConfig, initServerTelemetry } from "@/core/observability/telemetry";
import { uploadDir } from "@/configs/upload-dir";

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
    this.app.get("", (_req: Request, res: Response) => {
      res.json({ status: "OK", timestamp: new Date().toISOString() });
    });

    // Public routes (specific routes first)
    this.app.get("/", (_req, res) => {
      res.status(200).send("OK");
    });

    this.app.get("/health", async (_req, res) => {
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
    });
    this.app.use("", mainRouter);

    this.app.use(createCopilotKitRouter());
    // Generic API route (catch-all for /api)
    // this.app.use("/api", apikeyAuthMiddleware, (req: Request, res: Response, next: NextFunction) => {
    //   res.json({ status: "Success!", message: "API is running", timestamp: new Date().toISOString() })
    // })

    this.app.post("/ai", handleBootstrapAiChat);
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
