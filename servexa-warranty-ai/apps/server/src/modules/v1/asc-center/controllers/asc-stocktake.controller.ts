import type { NextFunction, Request, Response } from "express";

import { ErrorHandler } from "@/core/helpers/error-handling.helper";
import { logger } from "@/core/logging/logging.config";
import { getRequestInfo } from "@/core/logging/logging.utils";
import { SuccessResponse } from "@/utils/success-response";

import type { IAscStocktakeService } from "../interfaces/asc-stocktake-service.interface";
import { AscStocktakeService } from "../services/asc-stocktake.service";
import {
  findAllAscStocktakesSchema,
  findAscCenterIdParamSchema,
  findByIdSchema,
  findStocktakeAccessoriesSchema,
  findStocktakeStockLevelsSchema,
  createAscStocktakeSchema,
} from "../validations/asc-stocktake";

export class AscStocktakeController {
  errorHandler: ErrorHandler;

  constructor(
    private readonly service: IAscStocktakeService = new AscStocktakeService(),
  ) {
    this.errorHandler = ErrorHandler.getInstance();
  }

  findHistoryByCenter = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching ASC stocktake history", {
        ...getRequestInfo(req, "AscStocktakeController.findHistoryByCenter"),
      });

      const params = findAscCenterIdParamSchema.parse(req.params);
      const query = findAllAscStocktakesSchema.parse(req.query);

      const result = await this.service.findHistoryByCenter({
        ...params,
        ...query,
      });

      new SuccessResponse({
        message: "Stocktake history fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching ASC stocktake by id", {
        ...getRequestInfo(req, "AscStocktakeController.findOneById"),
      });

      const { id } = findByIdSchema.parse(req.params);
      const result = await this.service.findOneById(id);

      new SuccessResponse({
        message: "Stocktake fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  findAccessoriesForStocktake = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching accessories for stocktake", {
        ...getRequestInfo(
          req,
          "AscStocktakeController.findAccessoriesForStocktake",
        ),
      });

      const params = findAscCenterIdParamSchema.parse(req.params);
      const query = findStocktakeAccessoriesSchema.parse(req.query);

      const result = await this.service.findAccessoriesForStocktake({
        ...params,
        ...query,
      });

      new SuccessResponse({
        message: "Accessories fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  findStockLevels = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching stock levels for stocktake", {
        ...getRequestInfo(req, "AscStocktakeController.findStockLevels"),
      });

      const params = findAscCenterIdParamSchema.parse(req.params);
      const query = findStocktakeStockLevelsSchema.parse(req.query);

      const result = await this.service.findStockLevels({
        ...params,
        ...query,
      });

      new SuccessResponse({
        message: "Stock levels fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Creating ASC stocktake", {
        ...getRequestInfo(req, "AscStocktakeController.create"),
      });

      const userId = req.user.id;
      const body = createAscStocktakeSchema.parse(req.body);

      const result = await this.service.create(body, userId);

      new SuccessResponse({
        message: "Stocktake created successfully",
        status: 201,
        metadata: result,
      }).send(res);
    })(req, res, next);
  };
}
