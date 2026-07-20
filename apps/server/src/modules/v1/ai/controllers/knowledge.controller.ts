import type { NextFunction, Request, Response } from "express";

import { ErrorHandler } from "@/core/helpers/error-handling.helper";
import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { SuccessResponse } from "@/utils/success-response";
import {
  aiKnowledgeIngestDocumentBodySchema,
  aiKnowledgeIngestTextBodySchema,
  aiKnowledgeInternalIngestBodySchema,
  aiKnowledgeJobContextSchema,
  aiKnowledgeReindexBodySchema,
  aiKnowledgeSearchQuerySchema,
} from "@/modules/v1/ai/schemas/ai-knowledge.schema";
import { KnowledgeIngestionService } from "@/modules/v1/ai/services/knowledge-ingestion.service";
import { KnowledgeRetrievalService } from "@/modules/v1/ai/services/knowledge-retrieval.service";
import { env } from "@servexa-warranty-ai/env/server";
import { createOperationalError } from "@/middlewares/error-middleware";
import { logger } from "@/core/logging";

class KnowledgeController {
  readonly errorHandler: ErrorHandler;
  private ingestion: KnowledgeIngestionService;
  private retrieval: KnowledgeRetrievalService;

  constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.ingestion = new KnowledgeIngestionService();
    this.retrieval = new KnowledgeRetrievalService();
  }

  ingestText = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      const body = aiKnowledgeIngestTextBodySchema.parse(req.body);
      const result = await this.ingestion.ingestPlainText(body);
      new SuccessResponse({
        status: HTTP_RESPONSE_CODE.OK,
        message: "Knowledge ingested",
        metadata: result,
      }).send(res);
    })(req, res, next);

  ingestDocument = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      const body = aiKnowledgeIngestDocumentBodySchema.parse(req.body);
      const result = await this.ingestion.ingestDocument(body);
      new SuccessResponse({
        status: HTTP_RESPONSE_CODE.OK,
        message: "Document ingested",
        metadata: result,
      }).send(res);
    })(req, res, next);

  reindexDocument = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      const body = aiKnowledgeReindexBodySchema.parse(req.body);
      const result = await this.ingestion.reindexDocument(body);
      new SuccessResponse({
        status: HTTP_RESPONSE_CODE.OK,
        message: "Document reindexed",
        metadata: result,
      }).send(res);
    })(req, res, next);

  search = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      const q = aiKnowledgeSearchQuerySchema.parse(req.query);
      const rows = await this.retrieval.hybridSearch({
        tenantId: q.tenantId,
        documentScope: q.documentScope,
        query: q.q,
        topK: q.topK,
      });
      new SuccessResponse({
        status: HTTP_RESPONSE_CODE.OK,
        message: "Hybrid search results",
        metadata: {
          citations: rows.map((r, i) => ({
            id: i + 1,
            chunkId: r.chunkId,
            documentId: r.documentId,
            distance: r.distance,
            lexicalHit: r.lexicalHit,
            score: r.score,
            preview: r.text.slice(0, 400),
          })),
        },
      }).send(res);
    })(req, res, next);

  /** Worker-only: protected by `x-internal-ingest-key` (see docs/architecture/AI_RUNTIME.md#ai-runtime-policy). */
  internalIngest = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      const key = req.headers["x-internal-ingest-key"];
      if (
        typeof key !== "string" ||
        !env.AI_INTERNAL_INGEST_SECRET ||
        key !== env.AI_INTERNAL_INGEST_SECRET
      ) {
        throw createOperationalError("Forbidden", HTTP_RESPONSE_CODE.FORBIDDEN);
      }
      const body = aiKnowledgeInternalIngestBodySchema.parse(req.body);
      if (body.envelope.type !== "knowledge_ingest") {
        throw createOperationalError(
          "Invalid job type for internal ingest",
          HTTP_RESPONSE_CODE.BAD_REQUEST,
        );
      }
      const ctx = aiKnowledgeJobContextSchema.parse(body.envelope.context);
      let result: { documentId: string; chunkCount: number };
      if (ctx.ingestKind === "plainText") {
        result = await this.ingestion.ingestPlainText(aiKnowledgeIngestTextBodySchema.parse(ctx.plainText));
      } else {
        result = await this.ingestion.ingestDocument(
          aiKnowledgeIngestDocumentBodySchema.parse(ctx.document),
        );
      }
      logger.info("[knowledge] internal_ingest_ok", {
        jobId: body.envelope.jobId,
        documentId: result.documentId,
        chunkCount: result.chunkCount,
      });
      new SuccessResponse({
        status: HTTP_RESPONSE_CODE.OK,
        message: "Internal knowledge ingest completed",
        metadata: result,
      }).send(res);
    })(req, res, next);
}

export default new KnowledgeController();
