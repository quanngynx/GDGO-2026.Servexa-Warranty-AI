/**
 * Unary gRPC client for Python `ai.v1.AiService.ProcessRequest`.
 *
 * Production: set AI_GRPC_USE_TLS=true where the channel is terminated with TLS,
 * restrict traffic to VPC / internal meshes, and protect with metadata bearer keys.
 */
import * as grpc from "@grpc/grpc-js";
import { env } from "@servexa-warranty-ai/env/server";

import { loadAiGrpcPackage } from "./load-ai-grpc-definition";
import { logger } from "@/core/logging";

export type AiProcessRequestInput = {
  message: string;
  traceId: string;
  userId: string;
  tenantId: string;
  role: string;
  contextJson: string;
  /** Proto contract version; default "1". */
  requestVersion?: string;
  jobId?: string;
  jobType?: string;
  /** JSON string merged from Redis job envelope `context` + routing hints. */
  executionContextJson?: string;
};

export type AiProcessRequestOutput = {
  output: string;
  metadataJson: string;
};

export type AiGrpcUnaryCall = (
  request: AiProcessGrpcPayload,
  metadata: grpc.Metadata,
  options: grpc.CallOptions,
  callback: (error: grpc.ServiceError | null, response?: AiProcessGrpcResponse) => void,
) => grpc.ClientUnaryCall;

type AiProcessGrpcPayload = {
  message: string;
  trace_id: string;
  user_id: string;
  tenant_id: string;
  role: string;
  context_json: string;
  request_version: string;
  job_id: string;
  job_type: string;
  execution_context_json: string;
};

type AiProcessGrpcResponse = {
  output: string;
  metadata_json: string;
};

export type AiGrpcClient = grpc.Client & { processRequest?: AiGrpcUnaryCall; ProcessRequest?: AiGrpcUnaryCall };

let sharedClient: AiGrpcClient | null = null;

function resolveTarget(): string {
  return `${env.AI_GRPC_HOST!}:${env.AI_GRPC_PORT}`;
}

export function grpcChannelCredentials(): grpc.ChannelCredentials {
  if (env.AI_GRPC_USE_TLS) {
    return grpc.credentials.createSsl();
  }
  return grpc.credentials.createInsecure();
}

/** @internal Tests may reset singleton */
export function resetAiGrpcClientForTests(): void {
  sharedClient = null;
}

function getProcessRequest(client: AiGrpcClient): AiGrpcUnaryCall {
  const call = client.processRequest ?? client.ProcessRequest;
  if (typeof call !== "function") {
    throw new Error("ai.v1.AiService has no unary ProcessRequest RPC on stub");
  }
  return call.bind(client) as AiGrpcUnaryCall;
}

function getAiClient(): AiGrpcClient {
  if (!sharedClient) {
    const ServiceCtor = loadAiGrpcPackage();
    sharedClient = new ServiceCtor(
      resolveTarget(),
      grpcChannelCredentials(),
    ) as unknown as AiGrpcClient;
    void getProcessRequest(sharedClient);
    logger.info("[ai-grpc] client initialized", {
      target: resolveTarget(),
      tls: env.AI_GRPC_USE_TLS,
      deadlineMs: env.AI_GRPC_DEADLINE_MS,
    });
  }
  return sharedClient;
}

export function isAiGrpcConfigured(): boolean {
  return Boolean(env.AI_GRPC_HOST?.trim?.());
}

function buildMetadata(): grpc.Metadata {
  const md = new grpc.Metadata();
  if (env.AI_GRPC_API_KEY) {
    md.add("authorization", `Bearer ${env.AI_GRPC_API_KEY}`);
  }
  return md;
}

export function processAiGrpcRequest(input: AiProcessRequestInput): Promise<AiProcessRequestOutput> {
  if (!isAiGrpcConfigured()) {
    return Promise.reject(new Error("AI_GRPC_HOST is not configured"));
  }

  const client = getAiClient();
  const unary = getProcessRequest(client);
  const payload: AiProcessGrpcPayload = {
    message: input.message,
    trace_id: input.traceId,
    user_id: input.userId,
    tenant_id: input.tenantId,
    role: input.role,
    context_json: input.contextJson,
    request_version: input.requestVersion ?? "1",
    job_id: input.jobId ?? "",
    job_type: input.jobType ?? "",
    execution_context_json: input.executionContextJson ?? "{}",
  };

  const deadline = new Date(Date.now() + env.AI_GRPC_DEADLINE_MS);

  return new Promise((resolve, reject) => {
    unary(
      payload,
      buildMetadata(),
      { deadline },
      (error: grpc.ServiceError | null, response?: AiProcessGrpcResponse) => {
        if (error ?? !response) {
          logger.error("[ai-grpc] ProcessRequest failed", {
            code: error?.code,
            message: error?.message,
          });
          reject(error ?? new Error("empty gRPC response"));
          return;
        }
        resolve({
          output: response.output ?? "",
          metadataJson: response.metadata_json ?? "{}",
        });
      },
    );
  });
}
