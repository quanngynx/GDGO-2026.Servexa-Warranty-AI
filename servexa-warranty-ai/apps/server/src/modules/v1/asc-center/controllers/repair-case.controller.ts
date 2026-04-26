import type { NextFunction, Request, Response } from "express";
import fs from "fs";

import { ErrorHandler } from "@/core/helpers/error-handling.helper";
import { logger } from "@/core/logging/logging.config";
import { getRequestInfo } from "@/core/logging/logging.utils";
import { SuccessResponse } from "@/utils/success-response";
import { createOperationalError } from "@/middlewares/error-middleware";
import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";

import type { IRepairCaseService } from "../interfaces/repair-case-service.interface";
import { RepairCaseService } from "../services/repair-case.service";
import {
  findAllRepairCasesSchema,
  findWaitingAccessoriesSchema,
  findRepairCaseByIdSchema,
  findHistoryByIdSchema,
  createRepairCaseSchema,
  replaceRepairCaseSchema,
  updateRepairCaseSchema,
  grantAccessoriesSchema,
  uploadImagesSchema,
  exportRepairCasesSchema,
  findImageByIdSchema,
  findAccessoryRowByIdSchema,
} from "../validations";

export class RepairCaseController {
  errorHandler: ErrorHandler;

  constructor(
    private readonly service: IRepairCaseService = new RepairCaseService(),
  ) {
    this.errorHandler = ErrorHandler.getInstance();
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching repair cases", {
        ...getRequestInfo(req, "RepairCaseController.findAll"),
      });

      const query = findAllRepairCasesSchema.parse({ query: req.query }).query;
      const result = await this.service.findAll(query);

      new SuccessResponse({
        message: "Repair cases fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  findWaitingAccessories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching waiting accessories repair cases", {
        ...getRequestInfo(req, "RepairCaseController.findWaitingAccessories"),
      });

      const query = findWaitingAccessoriesSchema.parse({
        query: req.query,
      }).query;
      const result = await this.service.findWaitingAccessories(query);

      new SuccessResponse({
        message: "Waiting accessories cases fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching repair case by id", {
        ...getRequestInfo(req, "RepairCaseController.findOneById"),
      });

      const { id } = findRepairCaseByIdSchema.parse({
        params: req.params,
      }).params;
      const result = await this.service.findOneById(id);

      new SuccessResponse({
        message: "Repair case fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  findStatusHistory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return this.errorHandler.asyncHandler(async () => {
      const { id } = findHistoryByIdSchema.parse({ params: req.params }).params;
      const result = await this.service.findStatusHistory(id);

      new SuccessResponse({
        message: "Status history fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  findFieldHistory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return this.errorHandler.asyncHandler(async () => {
      const { id } = findHistoryByIdSchema.parse({ params: req.params }).params;
      const result = await this.service.findFieldHistory(id);

      new SuccessResponse({
        message: "Field history fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  findAccessoryRequests = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return this.errorHandler.asyncHandler(async () => {
      const { id } = findHistoryByIdSchema.parse({ params: req.params }).params;
      const result = await this.service.findAccessoryRequests(id);

      new SuccessResponse({
        message: "Accessory requests fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  findImages = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      const { id } = findHistoryByIdSchema.parse({ params: req.params }).params;
      const result = await this.service.findImages(id);

      new SuccessResponse({
        message: "Images fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  downloadImage = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Downloading image", {
        ...getRequestInfo(req, "RepairCaseController.downloadImage"),
      });
      const { id, imageId } = findImageByIdSchema.parse({
        params: req.params,
      }).params;
      const img = await this.service.findImageById(id, imageId);
      if (!fs.existsSync(img.imagePath)) {
        throw createOperationalError(
          "File not found on disk",
          HTTP_RESPONSE_CODE.NOT_FOUND,
        );
      }

      res.setHeader("Content-Type", img.mimeType || "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${img.originalFilename}"`,
      );
      fs.createReadStream(img.imagePath).pipe(res);
    })(req, res, next);
  };

  exportFixing = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Exporting fixing", {
        ...getRequestInfo(req, "RepairCaseController.exportFixing"),
      });
      const query = exportRepairCasesSchema.parse({ query: req.query }).query;
      const workbook = await this.service.exportFixing(query);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="repair_cases_fixing.xlsx"',
      );
      await workbook.xlsx.write(res);
      res.end();
    })(req, res, next);
  };

  exportWaitingParts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Exporting waiting parts", {
        ...getRequestInfo(req, "RepairCaseController.exportWaitingParts"),
      });
      const query = exportRepairCasesSchema.parse({ query: req.query }).query;
      const workbook = await this.service.exportWaitingParts(query);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="repair_cases_waiting_parts.xlsx"',
      );
      await workbook.xlsx.write(res);
      res.end();
    })(req, res, next);
  };

  exportExchangeInProgress = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Exporting exchange in progress", {
        ...getRequestInfo(req, "RepairCaseController.exportExchangeInProgress"),
      });
      const query = exportRepairCasesSchema.parse({ query: req.query }).query;
      const workbook = await this.service.exportExchangeInProgress(query);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="repair_cases_exchange_in_progress.xlsx"',
      );
      await workbook.xlsx.write(res);
      res.end();
    })(req, res, next);
  };

  exportRepeatedHuyphieu = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Exporting repeated huyphieu", {
        ...getRequestInfo(req, "RepairCaseController.exportRepeatedHuyphieu"),
      });
      const query = exportRepairCasesSchema.parse({ query: req.query }).query;
      const workbook = await this.service.exportRepeatedHuyphieu(query);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="repair_cases_repeated_huyphieu.xlsx"',
      );
      await workbook.xlsx.write(res);
      res.end();
    })(req, res, next);
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Creating repair case", {
        ...getRequestInfo(req, "RepairCaseController.create"),
      });

      const body = createRepairCaseSchema.parse({ body: req.body }).body;
      const userId = req.user.id;
      const result = await this.service.create(body, userId);

      new SuccessResponse({
        message: "Repair case created successfully",
        status: 201,
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  replace = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Replacing repair case", {
        ...getRequestInfo(req, "RepairCaseController.replace"),
      });

      const { id } = replaceRepairCaseSchema.parse({
        params: req.params,
        body: req.body,
      }).params;
      const body = replaceRepairCaseSchema.parse({
        params: req.params,
        body: req.body,
      }).body;
      const userId = req.user.id;
      const result = await this.service.replace(id, body, userId);

      new SuccessResponse({
        message: "Repair case replaced successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Updating repair case", {
        ...getRequestInfo(req, "RepairCaseController.update"),
      });

      const { id } = updateRepairCaseSchema.parse({
        params: req.params,
        body: req.body,
      }).params;
      const body = updateRepairCaseSchema.parse({
        params: req.params,
        body: req.body,
      }).body;
      const userId = req.user.id;
      const result = await this.service.update(id, body, userId);

      new SuccessResponse({
        message: "Repair case updated successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  grantAccessories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Granting accessories to repair case", {
        ...getRequestInfo(req, "RepairCaseController.grantAccessories"),
      });

      const { id } = grantAccessoriesSchema.parse({
        params: req.params,
        body: req.body,
      }).params;
      const body = grantAccessoriesSchema.parse({
        params: req.params,
        body: req.body,
      }).body;
      const userId = req.user.id;
      const result = await this.service.grantAccessories(id, body, userId);

      new SuccessResponse({
        message: "Accessories granted successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  revokeAccessory = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Revoking accessory from repair case", {
        ...getRequestInfo(req, "RepairCaseController.revokeAccessory"),
      });

      const { id } = findHistoryByIdSchema.parse({ params: req.params }).params;
      const { accessoryRowId } = findAccessoryRowByIdSchema.parse({
        params: req.params,
      }).params;
      const userId = req.user.id;
      await this.service.revokeAccessory(id, accessoryRowId, userId);

      new SuccessResponse({
        message: "Accessory revoked successfully",
        metadata: null,
      }).send(res);
    })(req, res, next);
  };

  addImages = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Adding images to repair case", {
        ...getRequestInfo(req, "RepairCaseController.addImages"),
      });

      const { id } = uploadImagesSchema.parse({
        params: req.params,
        body: req.body,
      }).params;
      const body = uploadImagesSchema.parse({
        params: req.params,
        body: req.body,
      }).body;
      const userId = req.user.id;
      const files = req.files as Express.Multer.File[];
      const result = await this.service.addImages(
        id,
        files,
        body.imageType,
        body.description,
        userId,
      );

      new SuccessResponse({
        message: "Images added successfully",
        status: 201,
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  deleteImage = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Deleting image from repair case", {
        ...getRequestInfo(req, "RepairCaseController.deleteImage"),
      });

      const { id } = findHistoryByIdSchema.parse({ params: req.params }).params;
      const { imageId } = findImageByIdSchema.parse({
        params: req.params,
      }).params;
      await this.service.deleteImage(id, imageId);

      new SuccessResponse({
        message: "Image deleted successfully",
        metadata: null,
      }).send(res);
    })(req, res, next);
  };
}
