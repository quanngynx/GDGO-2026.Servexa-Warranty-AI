import type { NextFunction, Request, Response } from "express";

import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { ErrorHandler } from "@/core/helpers/error-handling.helper";
import { createOperationalError } from "@/middlewares/error-middleware";

import { reasoningTraceIdParamsSchema, reasoningTraceListQuerySchema } from "../schemas/reasoning-trace.schema";

import type { AccessTokenPayload } from "@/types/jwt";

import { ReasoningTraceService } from "../services/reasoning-trace.service";
import { SuccessResponse } from "@/utils/success-response";

class ReasoningTraceController {
  readonly errorHandler: ErrorHandler;
  private readonly service = new ReasoningTraceService();

  constructor() {
    this.errorHandler = ErrorHandler.getInstance();
  }

  private requireUser(req: Request): AccessTokenPayload {
    if (!req.user) {
      throw createOperationalError("Unauthorized", HTTP_RESPONSE_CODE.UNAUTHORIZED);
    }
    return req.user;
  }

  getTrace = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      const user = this.requireUser(req);
      const { traceId } = reasoningTraceIdParamsSchema.parse(req.params);
      const trace = await this.service.findByTraceId(user, traceId);
      new SuccessResponse({
        message: "Reasoning trace",
        metadata: trace,
      }).send(res);
    })(req, res, next);

  listTraces = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      const user = this.requireUser(req);
      const query = reasoningTraceListQuerySchema.parse(req.query);
      if (!query.repairCaseId) {
        throw createOperationalError(
          "repairCaseId query param is required",
          HTTP_RESPONSE_CODE.BAD_REQUEST,
        );
      }
      const items = await this.service.listByRepairCaseId(user, query.repairCaseId);
      new SuccessResponse({
        message: "Reasoning traces",
        metadata: { items },
      }).send(res);
    })(req, res, next);

  listEvents = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      const user = this.requireUser(req);
      const { traceId } = reasoningTraceIdParamsSchema.parse(req.params);
      const items = await this.service.listEventsByTraceId(user, traceId);
      new SuccessResponse({
        message: "Reasoning trace events",
        metadata: { items },
      }).send(res);
    })(req, res, next);
}

export default new ReasoningTraceController();

