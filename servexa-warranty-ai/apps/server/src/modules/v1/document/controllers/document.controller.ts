import type { NextFunction, Request, Response } from "express";

import { ErrorHandler } from "@/core/helpers/error-handling.helper";
import { logger } from "@/core/logging/logging.config";
import { getRequestInfo } from "@/core/logging/logging.utils";
import { SuccessResponse } from "@/utils/success-response";

import type { IDocumentService } from "../interfaces/document-service.interface";
import type { FileUploadMeta } from "../interfaces/document-service.interface";
import { DocumentService } from "../services/document.service";
import {
  createDocumentSchema,
  findAllDocumentsSchema,
  findDocumentByIdSchema,
  replaceDocumentSchema,
  updateDocumentSchema,
} from "../validations";

const toFileUploadMeta = (file: Express.Multer.File): FileUploadMeta => ({
  filePath: file.path,
  originalFileName: file.originalname,
  fileSize: file.size,
  mimeType: file.mimetype,
  checksum: "", // computed inside service from disk
});

export class DocumentController {
  private readonly errorHandler: ErrorHandler;

  constructor(
    private readonly documentService: IDocumentService = new DocumentService(),
  ) {
    this.errorHandler = ErrorHandler.getInstance();
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching documents", {
        ...getRequestInfo(req, "DocumentController.findAll"),
      });
      const query = findAllDocumentsSchema.parse(req.query);
      const result = await this.documentService.findAll(query);
      new SuccessResponse({
        message: "Documents fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching document", {
        ...getRequestInfo(req, "DocumentController.findOneById"),
      });
      const { documentId } = findDocumentByIdSchema.parse(req.params);
      const result = await this.documentService.findOneById(documentId);
      new SuccessResponse({
        message: "Document fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Creating document", {
        ...getRequestInfo(req, "DocumentController.create"),
      });
      const body = createDocumentSchema.parse(req.body);
      const file = req.file ? toFileUploadMeta(req.file) : undefined;
      const result = await this.documentService.create(body, req.user.id, file);
      new SuccessResponse({
        message: "Document created successfully",
        status: 201,
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  replace = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Replacing document", {
        ...getRequestInfo(req, "DocumentController.replace"),
      });
      const { documentId } = findDocumentByIdSchema.parse(req.params);
      const body = replaceDocumentSchema.parse(req.body);
      const file = req.file ? toFileUploadMeta(req.file) : undefined;
      const result = await this.documentService.replace(
        documentId,
        body,
        req.user.id,
        file,
      );
      new SuccessResponse({
        message: "Document replaced successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Updating document", {
        ...getRequestInfo(req, "DocumentController.update"),
      });
      const { documentId } = findDocumentByIdSchema.parse(req.params);
      const body = updateDocumentSchema.parse(req.body);
      const result = await this.documentService.update(
        documentId,
        body,
        req.user.id,
      );
      new SuccessResponse({
        message: "Document updated successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Deleting document", {
        ...getRequestInfo(req, "DocumentController.delete"),
      });
      const { documentId } = findDocumentByIdSchema.parse(req.params);
      const result = await this.documentService.delete(documentId, req.user.id);
      new SuccessResponse({
        message: "Document deleted successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  findVersions = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching document versions", {
        ...getRequestInfo(req, "DocumentController.findVersions"),
      });
      const { documentId } = findDocumentByIdSchema.parse(req.params);
      const result = await this.documentService.findVersions(documentId);
      new SuccessResponse({
        message: "Document versions fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };
}
