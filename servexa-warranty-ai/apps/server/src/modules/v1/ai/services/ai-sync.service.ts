import type { Request } from "express";

import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import {
  createOperationalError,
  OperationalError,
} from "@/middlewares/error-middleware";
import { logger } from "@/core/logging";
import { completeUnaryPrompt } from "@/modules/v1/ai/runtime/ai-completion-runtime";

import { buildAiContextJson } from "./ai-context.builder";
import type { AiSyncQueryBody } from "@/modules/v1/ai/schemas/ai-request.schema";

export type AiProcessRequestOutput = {
  output: string;
  metadataJson: string;
};

export class AiSyncService {
  async unaryGrpcQuery(req: Request, body: AiSyncQueryBody): Promise<AiProcessRequestOutput> {
    const { allowAsync: _allowAsyncIgnored, ...queryFields } = body;
    void _allowAsyncIgnored;

    const tenantFromToken = "";
    const tenantId = queryFields.tenantId ?? tenantFromToken;

    const contextJson = buildAiContextJson(req, {
      ...(queryFields.context ?? {}),
      ...(tenantId ? { tenantId } : {}),
    });

    const traceId = req.requestId ?? "trace-unknown";

    const started = performance.now();
    try {
      const result = await completeUnaryPrompt(
        {
          prompt: queryFields.query,
          traceId,
          userId: req.user?.id ?? "anonymous",
          tenantId,
          role: req.user?.role ? String(req.user.role) : "",
          contextJson,
        },
        { requireGrpc: true },
      );
      logger.info("[ai-sync] unary completed", {
        traceId,
        backend: result.backend,
        ms: Math.round(performance.now() - started),
      });
      return {
        output: result.text,
        metadataJson: result.metadataJson,
      };
    } catch (error) {
      if (error instanceof OperationalError) {
        throw error;
      }
      logger.error("[ai-sync] unary failed", {
        traceId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw createOperationalError(
        "Upstream AI unavailable",
        HTTP_RESPONSE_CODE.BAD_GATEWAY,
      );
    }
  }
}
