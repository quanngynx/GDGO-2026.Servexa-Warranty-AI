import type { NextFunction, Request, Response } from "express";

import { ErrorHandler } from "@/core/helpers/error-handling.helper";
import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { SuccessResponse } from "@/utils/success-response";
import {
  multiAgentCoordinateBodySchema,
  toolInvokeBodySchema,
  workflowStepBodySchema,
} from "@/modules/v1/ai/schemas/workflow.schema";
import { logAiAuditEvent } from "@/modules/v1/ai/governance/ai-audit";
import type { WorkflowDefinition } from "@/modules/v1/workflows/workflow-engine";
import { warrantyClaimIntakeWorkflow } from "@/modules/v1/workflows/warranty-claim-intake";
import { WorkflowEngine } from "@/modules/v1/workflows/workflow-engine";
import { invokeTool, listRegisteredTools, registerTool } from "@/modules/v1/workflows/tool-registry";
import { createOperationalError } from "@/middlewares/error-middleware";
import { isAiGrpcConfigured, processAiGrpcRequest } from "@/core/infra/grpc/ai-grpc.client";

registerTool({
  name: "echo",
  timeoutMs: 2000,
  run: async (input) => input,
});

const workflows: Record<string, WorkflowDefinition> = {
  warranty_claim_intake: warrantyClaimIntakeWorkflow,
};

class WorkflowController {
  readonly errorHandler: ErrorHandler;
  private engine: WorkflowEngine;

  constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.engine = new WorkflowEngine();
  }

  step = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      const body = workflowStepBodySchema.parse(req.body);
      const def = workflows[body.workflowKey]!;
      const { nextStatus, terminal } = this.engine.runTransition(def, body.status, body.event);
      new SuccessResponse({
        status: HTTP_RESPONSE_CODE.OK,
        message: "Workflow transition",
        metadata: { nextStatus, terminal },
      }).send(res);
    })(req, res, next);

  invokeTool = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      const body = toolInvokeBodySchema.parse(req.body);
      logAiAuditEvent("tool_invoke", { name: body.name, userId: req.user?.id });
      const result = await invokeTool(body.name, body.payload ?? null);
      new SuccessResponse({
        status: HTTP_RESPONSE_CODE.OK,
        message: "Tool result",
        metadata: { result },
      }).send(res);
    })(req, res, next);

  listTools = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      new SuccessResponse({
        status: HTTP_RESPONSE_CODE.OK,
        message: "Registered tools",
        metadata: { tools: listRegisteredTools() },
      }).send(res);
    })(req, res, next);

  coordinate = (req: Request, res: Response, next: NextFunction) =>
    this.errorHandler.asyncHandler(async () => {
      const body = multiAgentCoordinateBodySchema.parse(req.body);
      if (!isAiGrpcConfigured()) {
        throw createOperationalError(
          "AI gRPC is not configured (set AI_GRPC_HOST)",
          HTTP_RESPONSE_CODE.SERVICE_UNAVAILABLE,
        );
      }
      const traceId = typeof req.requestId === "string" ? req.requestId : "trace-unknown";
      const out = await processAiGrpcRequest({
        message: body.goal,
        traceId,
        userId: req.user?.id ?? "anonymous",
        tenantId: body.tenantId ?? "",
        role: req.user?.role ? String(req.user.role) : "",
        contextJson: JSON.stringify({ source: "workflow:coordinate" }),
        executionContextJson: JSON.stringify({
          requestKind: "multi_agent_coordinate",
          goal: body.goal,
        }),
      });
      let grpcMetadata: Record<string, unknown> = {};
      try {
        grpcMetadata = JSON.parse(out.metadataJson) as Record<string, unknown>;
      } catch {
        grpcMetadata = {};
      }
      logAiAuditEvent("multi_agent_run", { goal: body.goal, userId: req.user?.id });
      new SuccessResponse({
        status: HTTP_RESPONSE_CODE.OK,
        message: "Multi-agent result",
        metadata: {
          result: out.output,
          grpcMetadata,
        },
      }).send(res);
    })(req, res, next);
}

export default new WorkflowController();
