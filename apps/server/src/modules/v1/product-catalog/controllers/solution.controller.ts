import type { NextFunction, Request, Response } from "express";
import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { ErrorHandler } from "@/core/helpers/error-handling.helper";
import { logger } from "@/core/logging/logging.config";
import { getRequestInfo } from "@/core/logging/logging.utils";
import { createOperationalError } from "@/middlewares/error-middleware";
import { SuccessResponse } from "@/utils/success-response";

import type { ISolutionService } from "../interfaces/solution-service.interface";
import type { ISolutionExcelService } from "../interfaces/solution-excel-service.interface";
import { SolutionService } from "../services/solution.service";
import { SolutionExcelService } from "../services/solution-excel.service";
import {
  createSolutionSchema,
  findAllSolutionsSchema,
  findByIdSchema,
  replaceSolutionSchema,
  updateSolutionSchema,
  importLinkSchema,
} from "../validations/solution";

export class SolutionController {
  errorHandler: ErrorHandler;

  constructor(
    private readonly solutionService: ISolutionService = new SolutionService(),
    private readonly solutionExcelService: ISolutionExcelService = new SolutionExcelService(),
  ) {
    this.errorHandler = ErrorHandler.getInstance();
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching solutions", {
        ...getRequestInfo(req, "SolutionController.findAll"),
      });

      const query = findAllSolutionsSchema.parse(req.query);
      const result = await this.solutionService.findAll(query);

      new SuccessResponse({
        message: "Solutions fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching solution", {
        ...getRequestInfo(req, "SolutionController.findOneById"),
      });

      const { id } = findByIdSchema.parse(req.params);
      const result = await this.solutionService.findOneById(id);

      new SuccessResponse({
        message: "Solution fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Creating solution", {
        ...getRequestInfo(req, "SolutionController.create"),
      });

      const body = createSolutionSchema.parse(req.body);
      // `req.user` should be injected by the authenticate middleware
      const userId = req.user.id;

      if (!userId) {
        throw createOperationalError(
          "User not authenticated",
          HTTP_RESPONSE_CODE.UNAUTHORIZED,
        );
      }

      const result = await this.solutionService.create({
        ...body,
        createdBy: userId,
      });

      new SuccessResponse({
        message: "Solution created successfully",
        status: 201,
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  replace = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Replacing solution", {
        ...getRequestInfo(req, "SolutionController.replace"),
      });

      const { id } = findByIdSchema.parse(req.params);
      const body = replaceSolutionSchema.parse(req.body);
      const result = await this.solutionService.update(id, body);

      new SuccessResponse({
        message: "Solution updated successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Updating solution", {
        ...getRequestInfo(req, "SolutionController.update"),
      });

      const { id } = findByIdSchema.parse(req.params);
      const body = updateSolutionSchema.parse(req.body);
      const result = await this.solutionService.update(id, body);

      new SuccessResponse({
        message: "Solution updated successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Deleting solution", {
        ...getRequestInfo(req, "SolutionController.delete"),
      });

      const { id } = findByIdSchema.parse(req.params);
      const result = await this.solutionService.delete(id);

      new SuccessResponse({
        message: "Solution deleted successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  export = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Exporting solutions", {
        ...getRequestInfo(req, "SolutionController.export"),
      });

      const workbook = await this.solutionExcelService.buildExportWorkbook();

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="solutions.xlsx"',
      );

      await workbook.xlsx.write(res);
      res.end();
    })(req, res, next);
  };

  import = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Importing solutions", {
        ...getRequestInfo(req, "SolutionController.import"),
      });

      if (!req.file) {
        throw createOperationalError(
          "No file uploaded",
          HTTP_RESPONSE_CODE.BAD_REQUEST,
        );
      }

      const userId = req.user?.id as string;
      if (!userId) {
        throw createOperationalError(
          "User not authenticated",
          HTTP_RESPONSE_CODE.UNAUTHORIZED,
        );
      }

      const result = await this.solutionExcelService.importExcel(
        new Uint8Array(req.file.buffer),
        userId,
      );

      new SuccessResponse({
        message: "Solutions import processed",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  importLink = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Importing solutions via link", {
        ...getRequestInfo(req, "SolutionController.importLink"),
      });

      const { url } = importLinkSchema.parse(req.body);

      const userId = req.user?.id as string;
      if (!userId) {
        throw createOperationalError(
          "User not authenticated",
          HTTP_RESPONSE_CODE.UNAUTHORIZED,
        );
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw createOperationalError(
            `Failed to fetch file: ${response.statusText}`,
            HTTP_RESPONSE_CODE.BAD_REQUEST,
          );
        }

        const arrayBuffer = await response.arrayBuffer();
        const result = await this.solutionExcelService.importExcel(
          new Uint8Array(arrayBuffer),
          userId,
        );

        new SuccessResponse({
          message: "Solutions import processed",
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
