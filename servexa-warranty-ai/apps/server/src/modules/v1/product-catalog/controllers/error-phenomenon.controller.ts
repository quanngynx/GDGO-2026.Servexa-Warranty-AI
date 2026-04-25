import type { NextFunction, Request, Response } from "express";
import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { ErrorHandler } from "@/core/helpers/error-handling.helper";
import { logger } from "@/core/logging/logging.config";
import { getRequestInfo } from "@/core/logging/logging.utils";
import { createOperationalError } from "@/middlewares/error-middleware";
import { SuccessResponse } from "@/utils/success-response";

import type { IErrorPhenomenonService } from "../interfaces/error-phenomenon-service.interface";
import type { IErrorPhenomenonExcelService } from "../interfaces/error-phenomenon-excel-service.interface";
import { ErrorPhenomenonService } from "../services/error-phenomenon.service";
import { ErrorPhenomenonExcelService } from "../services/error-phenomenon-excel.service";
import {
  createErrorPhenomenonSchema,
  findAllErrorPhenomenaSchema,
  findByIdSchema,
  replaceErrorPhenomenonSchema,
  updateErrorPhenomenonSchema,
  importLinkSchema,
} from "../validations/error-phenomenon";

export class ErrorPhenomenonController {
  errorHandler: ErrorHandler;

  constructor(
    private readonly errorPhenomenonService: IErrorPhenomenonService = new ErrorPhenomenonService(),
    private readonly errorPhenomenonExcelService: IErrorPhenomenonExcelService = new ErrorPhenomenonExcelService(),
  ) {
    this.errorHandler = ErrorHandler.getInstance();
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching error phenomena", {
        ...getRequestInfo(req, "ErrorPhenomenonController.findAll"),
      });

      const query = findAllErrorPhenomenaSchema.parse(req.query);
      const result = await this.errorPhenomenonService.findAll(query);

      new SuccessResponse({
        message: "Error phenomena fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching error phenomenon", {
        ...getRequestInfo(req, "ErrorPhenomenonController.findOneById"),
      });

      const { id } = findByIdSchema.parse(req.params);
      const result = await this.errorPhenomenonService.findOneById(id);

      new SuccessResponse({
        message: "Error phenomenon fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Creating error phenomenon", {
        ...getRequestInfo(req, "ErrorPhenomenonController.create"),
      });

      const body = createErrorPhenomenonSchema.parse(req.body);
      const result = await this.errorPhenomenonService.create(body);

      new SuccessResponse({
        message: "Error phenomenon created successfully",
        status: 201,
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  replace = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Replacing error phenomenon", {
        ...getRequestInfo(req, "ErrorPhenomenonController.replace"),
      });

      const { id } = findByIdSchema.parse(req.params);
      const body = replaceErrorPhenomenonSchema.parse(req.body);
      const result = await this.errorPhenomenonService.update(id, body);

      new SuccessResponse({
        message: "Error phenomenon updated successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Updating error phenomenon", {
        ...getRequestInfo(req, "ErrorPhenomenonController.update"),
      });

      const { id } = findByIdSchema.parse(req.params);
      const body = updateErrorPhenomenonSchema.parse(req.body);
      const result = await this.errorPhenomenonService.update(id, body);

      new SuccessResponse({
        message: "Error phenomenon updated successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Deleting error phenomenon", {
        ...getRequestInfo(req, "ErrorPhenomenonController.delete"),
      });

      const { id } = findByIdSchema.parse(req.params);
      const result = await this.errorPhenomenonService.delete(id);

      new SuccessResponse({
        message: "Error phenomenon deleted successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  export = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Exporting error phenomena", {
        ...getRequestInfo(req, "ErrorPhenomenonController.export"),
      });

      const workbook =
        await this.errorPhenomenonExcelService.buildExportWorkbook();

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="error-phenomena.xlsx"',
      );

      await workbook.xlsx.write(res);
      res.end();
    })(req, res, next);
  };

  import = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Importing error phenomena", {
        ...getRequestInfo(req, "ErrorPhenomenonController.import"),
      });

      if (!req.file) {
        throw createOperationalError(
          "No file uploaded",
          HTTP_RESPONSE_CODE.BAD_REQUEST,
        );
      }

      const result = await this.errorPhenomenonExcelService.importExcel(
        new Uint8Array(req.file.buffer),
      );

      new SuccessResponse({
        message: "Error phenomena import processed",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  importLink = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Importing error phenomena via link", {
        ...getRequestInfo(req, "ErrorPhenomenonController.importLink"),
      });

      const { url } = importLinkSchema.parse(req.body);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw createOperationalError(
            `Failed to fetch file: ${response.statusText}`,
            HTTP_RESPONSE_CODE.BAD_REQUEST,
          );
        }

        const arrayBuffer = await response.arrayBuffer();
        const result = await this.errorPhenomenonExcelService.importExcel(
          new Uint8Array(arrayBuffer),
        );

        new SuccessResponse({
          message: "Error phenomena import processed",
          metadata: result,
        }).send(res);
      } catch (error) {
        if (error instanceof Error && "statusCode" in error) {
          throw error;
        }
        throw createOperationalError(
          "Invalid URL or inaccessible file",
          HTTP_RESPONSE_CODE.BAD_REQUEST,
        );
      }
    })(req, res, next);
  };
}
