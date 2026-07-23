import { env } from "@servexa-warranty-ai/env/server";
import { logger } from "@/core/logging/logging.config";
import prisma from "@/core/infra/prisma";
import { connectBootstrapRedis } from "@/core/infra/ioredis/redis-bootstrap";
import { startProductExportWorker } from "@/modules/v1/product-catalog/workers/product-export.worker";

export class ExportWorkerBootstrap {
  public async bootstrap() {
    await this.initializeServices();
    this.startWorkers();
  }

  private async initializeServices(): Promise<void> {
    await prisma.$connect();
    logger.info(`[${env.BRANDING_NAME}] Export Worker Database connected successfully`);

    try {
      await connectBootstrapRedis();
      logger.info(`[${env.BRANDING_NAME}] Export Worker Redis connected successfully`);
    } catch (error) {
      logger.error(`[${env.BRANDING_NAME}] Export Worker Redis connection failed`, {
        error: error instanceof Error ? error.message : String(error),
      });
      if (env.NODE_ENV === "production") {
        throw error;
      }
    }
  }

  private startWorkers(): void {
    logger.info(`[${env.BRANDING_NAME}] Starting Product Export Worker...`);
    startProductExportWorker();
  }
}

const bootstrap = new ExportWorkerBootstrap();
void bootstrap.bootstrap();
