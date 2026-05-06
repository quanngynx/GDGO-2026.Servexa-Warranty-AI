import type { Request } from "express";

import {
  processAiGrpcRequest,
  type AiProcessRequestOutput,
  isAiGrpcConfigured,
} from "@/core/infra/grpc/ai-grpc.client";
import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { createOperationalError } from "@/middlewares/error-middleware";

import { buildAiContextJson } from "./ai-context.builder";
import type { AiSyncQueryBody } from "@/modules/v1/ai/schemas/ai-request.schema";
import { logger } from "@/core/logging";

export class AiSyncService {
  async unaryGrpcQuery(req: Request, body: AiSyncQueryBody): Promise<AiProcessRequestOutput> {
    if (!isAiGrpcConfigured()) {
      throw createOperationalError(
        "AI gRPC is not configured (set AI_GRPC_HOST)",
        HTTP_RESPONSE_CODE.SERVICE_UNAVAILABLE,
      );
    }

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
      const grpcOut = await processAiGrpcRequest({
        message: queryFields.query,
        traceId,
        userId: req.user?.id ?? "anonymous",
        tenantId,
        role: req.user?.role ? String(req.user.role) : "",
        contextJson,
      });
      logger.info("[ai-sync] unary gRPC succeeded", {
        traceId,
        ms: Math.round(performance.now() - started),
      });
      return grpcOut;
    } catch (error) {
      logger.error("[ai-sync] unary gRPC failed", {
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
