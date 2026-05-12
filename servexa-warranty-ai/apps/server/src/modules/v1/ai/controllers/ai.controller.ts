import type { NextFunction, Request, Response } from "express";

import { ErrorHandler } from "@/core/helpers/error-handling.helper";
import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import {
  OperationalError,
  createOperationalError,
} from "@/middlewares/error-middleware";
import { SuccessResponse } from "@/utils/success-response";
import {
  aiJobEnqueueBodySchema,
  aiJobReplayBodySchema,
  aiSyncQueryBodySchema,
} from "@/modules/v1/ai/schemas/ai-request.schema";
import { AiSyncService } from "@/modules/v1/ai/services/ai-sync.service";
import {
  AiJobStreamService,
} from "@/modules/v1/ai/services/ai-job-stream.service";
import { AiJobDuplicateError } from "@/core/helpers/exception.helper";

class AiController {
  readonly errorHandler: ErrorHandler;
  private aiSyncService: AiSyncService;

  constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.aiSyncService = new AiSyncService();
  }

  unaryQuery = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      const payload = aiSyncQueryBodySchema.parse(req.body);

      try {
        const result = await this.aiSyncService.unaryGrpcQuery(req, payload);
        new SuccessResponse({
          status: HTTP_RESPONSE_CODE.OK,
          message: "AI query completed",
          metadata: result,
        }).send(res);
      } catch (error) {
        if (
          payload.allowAsync &&
          error instanceof OperationalError &&
          error.statusCode === HTTP_RESPONSE_CODE.BAD_GATEWAY
        ) {
          const jobs = new AiJobStreamService();
          const { jobId, stream } = await jobs.enqueue({
            tenantId: payload.tenantId ?? "",
            userId: req.user?.id ?? "",
            type: "analysis",
            query: payload.query,
            context: {
              ...(payload.context ?? {}),
              fallbackReason: "grpc_unreachable",
            },
          });
          new SuccessResponse({
            status: HTTP_RESPONSE_CODE.ACCEPTED,
            message: "AI job queued after gRPC failure",
            metadata: { jobId, stream },
          }).send(res);
          return;
        }
        throw error;
      }
    })(req, res, next);

  enqueueJob = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      const parsed = aiJobEnqueueBodySchema.parse(req.body);
      const idempotencyKey = typeof req.headers["idempotency-key"] === "string"
        ? req.headers["idempotency-key"]
        : undefined;

      const jobs = new AiJobStreamService();
      try {
        const { jobId, stream } = await jobs.enqueue({
          ...parsed,
          tenantId: parsed.tenantId ?? "",
          userId: parsed.userId ?? req.user?.id ?? "",
          idempotencyKey,
        });

        new SuccessResponse({
          status: HTTP_RESPONSE_CODE.ACCEPTED,
          message: "AI job queued",
          metadata: { jobId, stream },
        }).send(res);
      } catch (error) {
        if (error instanceof AiJobDuplicateError) {
          throw createOperationalError(
            "Duplicate job submission",
            HTTP_RESPONSE_CODE.CONFLICT,
          );
        }
        throw error;
      }
    })(req, res, next);

  getJob = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      const jobId = String(req.params.jobId ?? "").trim();
      const jobs = new AiJobStreamService();
      await jobs.connect();

      const meta = await jobs.getJobMeta(jobId);

      new SuccessResponse({
        status: HTTP_RESPONSE_CODE.OK,
        message: "Job status",
        metadata: meta ?? { jobId, status: "unknown" },
      }).send(res);
    })(req, res, next);

  replayJob = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      const { jobId } = aiJobReplayBodySchema.parse(req.body);
      const jobs = new AiJobStreamService();
      const replay = await jobs.replayJob(jobId);
      if (!replay) {
        throw createOperationalError(
          "Job not found for replay",
          HTTP_RESPONSE_CODE.NOT_FOUND,
        );
      }

      new SuccessResponse({
        status: HTTP_RESPONSE_CODE.ACCEPTED,
        message: "Job replayed",
        metadata: replay,
      }).send(res);
    })(req, res, next);
}

export default new AiController();
