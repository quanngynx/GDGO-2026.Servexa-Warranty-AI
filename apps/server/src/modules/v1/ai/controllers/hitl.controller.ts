import type { NextFunction, Request, Response } from "express";

import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { ErrorHandler } from "@/core/helpers/error-handling.helper";
import { createOperationalError } from "@/middlewares/error-middleware";
import {
  createHitlRequestBodySchema,
  hitlRequestIdParamsSchema,
  listHitlRequestsQuerySchema,
  submitHitlDecisionBodySchema,
} from "@/modules/v1/ai/schemas/hitl.schema";
import { HitlService } from "@/modules/v1/ai/services/hitl.service";
import { SuccessResponse } from "@/utils/success-response";

class HitlController {
  readonly errorHandler: ErrorHandler;
  private readonly service = new HitlService();

  constructor() {
    this.errorHandler = ErrorHandler.getInstance();
  }

  createRequest = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      if (!req.user) {
        throw createOperationalError("Unauthorized", HTTP_RESPONSE_CODE.UNAUTHORIZED);
      }
      const body = createHitlRequestBodySchema.parse(req.body);
      const result = await this.service.createRequest(req.user, body);
      new SuccessResponse({
        status: HTTP_RESPONSE_CODE.CREATED,
        message: "HITL request created",
        metadata: result,
      }).send(res);
    })(req, res, next);

  listRequests = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      if (!req.user) {
        throw createOperationalError("Unauthorized", HTTP_RESPONSE_CODE.UNAUTHORIZED);
      }
      const query = listHitlRequestsQuerySchema.parse(req.query);
      const items = await this.service.listPending(req.user, query.scope);
      new SuccessResponse({
        message: "Pending HITL requests",
        metadata: { items },
      }).send(res);
    })(req, res, next);

  getRequest = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      if (!req.user) {
        throw createOperationalError("Unauthorized", HTTP_RESPONSE_CODE.UNAUTHORIZED);
      }
      const { id } = hitlRequestIdParamsSchema.parse(req.params);
      const result = await this.service.getById(req.user, id);
      new SuccessResponse({
        message: "HITL request",
        metadata: result,
      }).send(res);
    })(req, res, next);

  submitDecision = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      if (!req.user) {
        throw createOperationalError("Unauthorized", HTTP_RESPONSE_CODE.UNAUTHORIZED);
      }
      const { id } = hitlRequestIdParamsSchema.parse(req.params);
      const body = submitHitlDecisionBodySchema.parse(req.body);
      const result = await this.service.submitDecision(req.user, id, body);
      new SuccessResponse({
        message: "HITL decision recorded",
        metadata: result,
      }).send(res);
    })(req, res, next);

  resumeGraph = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      if (!req.user) {
        throw createOperationalError("Unauthorized", HTTP_RESPONSE_CODE.UNAUTHORIZED);
      }
      const { id } = hitlRequestIdParamsSchema.parse(req.params);
      const result = await this.service.resumeGraph(req.user, id);
      new SuccessResponse({
        message: "LangGraph workflow resumed",
        metadata: result,
      }).send(res);
    })(req, res, next);
}

export default new HitlController();
