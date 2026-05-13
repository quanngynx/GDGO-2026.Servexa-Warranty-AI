import type { NextFunction, Request, Response } from "express";

import { ErrorHandler } from "@/core/helpers/error-handling.helper";
import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { SuccessResponse } from "@/utils/success-response";
import { env } from "@servexa-warranty-ai/env/server";
import { listRegisteredTools } from "@/modules/v1/workflows/tool-registry";

class OpsController {
  readonly errorHandler: ErrorHandler;

  constructor() {
    this.errorHandler = ErrorHandler.getInstance();
  }

  summary = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      new SuccessResponse({
        status: HTTP_RESPONSE_CODE.OK,
        message: "AI operations snapshot",
        metadata: {
          ragContextEnabled: env.AI_RAG_CONTEXT_ENABLED,
          ragTopK: env.AI_RAG_CONTEXT_TOP_K,
          otelEnabled: env.OTEL_ENABLED,
          langfuseConfigured: Boolean(env.LANGFUSE_PUBLIC_KEY && env.LANGFUSE_SECRET_KEY),
          aiStreams: {
            analysis: env.AI_STREAM_ANALYSIS,
            chat: env.AI_STREAM_CHAT,
            report: env.AI_STREAM_REPORT,
            anomaly: env.AI_STREAM_ANOMALY,
            ingest: env.AI_STREAM_INGEST,
            retry: env.AI_STREAM_RETRY,
            dlq: env.AI_STREAM_DLQ,
          },
          toolsRegistered: listRegisteredTools(),
        },
      }).send(res);
    })(req, res, next);
}

export default new OpsController();
