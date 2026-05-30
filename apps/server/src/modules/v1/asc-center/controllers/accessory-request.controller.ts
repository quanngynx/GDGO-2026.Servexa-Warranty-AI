import type { NextFunction, Request, Response } from "express";

import { ErrorHandler } from "@/core/helpers/error-handling.helper";
import { logger } from "@/core/logging/logging.config";
import { getRequestInfo } from "@/core/logging/logging.utils";
import { SuccessResponse } from "@/utils/success-response";

import type { IAccessoryRequestService } from "../interfaces/accessory-request-service.interface";
import { AccessoryRequestService } from "../services/accessory-request.service";
import {
  findAllAccessoryRequestsSchema,
  createAccessoryRequestSchema,
  updateAccessoryRequestSchema,
  createAccessoryRequestItemSchema,
  updateAccessoryRequestItemSchema,
  approveAccessoryRequestSchema,
  rejectAccessoryRequestSchema,
  recallAccessoryRequestSchema,
  findAccessoryRequestByIdSchema,
  findAccessoryRequestItemByIdSchema,
} from "../validations";

export class AccessoryRequestController {
  errorHandler: ErrorHandler;

  constructor(
    private readonly service: IAccessoryRequestService = new AccessoryRequestService(),
  ) {
    this.errorHandler = ErrorHandler.getInstance();
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching accessory requests", {
        ...getRequestInfo(req, "AccessoryRequestController.findAll"),
      });
      const query = findAllAccessoryRequestsSchema.parse({
        query: req.query,
      }).query;
      const result = await this.service.findAll(query);
      new SuccessResponse({
        message: "Accessory requests fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching accessory request by id", {
        ...getRequestInfo(req, "AccessoryRequestController.findOneById"),
      });
      const { id } = findAccessoryRequestByIdSchema.parse({
        params: req.params,
      }).params;
      const result = await this.service.findOneById(id);
      new SuccessResponse({
        message: "Accessory request fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Creating accessory request", {
        ...getRequestInfo(req, "AccessoryRequestController.create"),
      });
      const userId = req.user.id;
      const body = createAccessoryRequestSchema.parse({ body: req.body }).body;
      const result = await this.service.create(body, userId);
      new SuccessResponse({
        message: "Accessory request created successfully",
        status: 201,
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Updating accessory request", {
        ...getRequestInfo(req, "AccessoryRequestController.update"),
      });
      const { id } = updateAccessoryRequestSchema.parse({
        params: req.params,
        body: req.body,
      }).params;
      const body = updateAccessoryRequestSchema.parse({
        params: req.params,
        body: req.body,
      }).body;
      const result = await this.service.update(id, body);
      new SuccessResponse({
        message: "Accessory request updated successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Deleting accessory request", {
        ...getRequestInfo(req, "AccessoryRequestController.delete"),
      });
      const { id } = findAccessoryRequestByIdSchema.parse({
        params: req.params,
      }).params;
      const result = await this.service.delete(id);
      new SuccessResponse({
        message: "Accessory request deleted successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  addItem = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Adding item to accessory request", {
        ...getRequestInfo(req, "AccessoryRequestController.addItem"),
      });
      const { id } = findAccessoryRequestByIdSchema.parse({
        params: req.params,
      }).params;
      const body = createAccessoryRequestItemSchema.parse(req.body);
      const result = await this.service.addItem(id, body);
      new SuccessResponse({
        message: "Item added successfully",
        status: 201,
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  updateItem = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Updating item in accessory request", {
        ...getRequestInfo(req, "AccessoryRequestController.updateItem"),
      });
      const { id, itemId } = updateAccessoryRequestItemSchema.parse({
        params: req.params,
        body: req.body,
      }).params;
      const body = updateAccessoryRequestItemSchema.parse({
        params: req.params,
        body: req.body,
      }).body;
      const result = await this.service.updateItem(id, itemId, body);
      new SuccessResponse({
        message: "Item updated successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  removeItem = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Removing item from accessory request", {
        ...getRequestInfo(req, "AccessoryRequestController.removeItem"),
      });
      const { id, itemId } = findAccessoryRequestItemByIdSchema.parse({
        params: req.params,
      }).params;
      const result = await this.service.removeItem(id, itemId);
      new SuccessResponse({
        message: "Item removed successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  submit = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Submitting accessory request", {
        ...getRequestInfo(req, "AccessoryRequestController.submit"),
      });
      const { id } = findAccessoryRequestByIdSchema.parse({
        params: req.params,
      }).params;
      const result = await this.service.submit(id);
      new SuccessResponse({
        message: "Accessory request submitted successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  approve = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Approving accessory request", {
        ...getRequestInfo(req, "AccessoryRequestController.approve"),
      });
      const userId = req.user.id;
      const { id } = approveAccessoryRequestSchema.parse({
        params: req.params,
        body: req.body,
      }).params;
      const body = approveAccessoryRequestSchema.parse({
        params: req.params,
        body: req.body,
      }).body;
      const result = await this.service.approve(id, body, userId);
      new SuccessResponse({
        message: "Accessory request approved",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  reject = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Rejecting accessory request", {
        ...getRequestInfo(req, "AccessoryRequestController.reject"),
      });
      const userId = req.user.id;
      const { id } = rejectAccessoryRequestSchema.parse({
        params: req.params,
        body: req.body,
      }).params;
      const body = rejectAccessoryRequestSchema.parse({
        params: req.params,
        body: req.body,
      }).body;
      const result = await this.service.reject(id, body, userId);
      new SuccessResponse({
        message: "Accessory request rejected",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  recall = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Recalling accessory request", {
        ...getRequestInfo(req, "AccessoryRequestController.recall"),
      });
      const { id } = recallAccessoryRequestSchema.parse({
        params: req.params,
        body: req.body,
      }).params;
      const body = recallAccessoryRequestSchema.parse({
        params: req.params,
        body: req.body,
      }).body;
      const result = await this.service.recall(id, body);
      new SuccessResponse({
        message: "Accessory request recalled",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };
}
