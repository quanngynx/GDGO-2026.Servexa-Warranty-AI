import { devToolsMiddleware } from "@ai-sdk/devtools";
import { google } from "@ai-sdk/google";
import { generateText, Output, wrapLanguageModel } from "ai";
import { z } from "zod";

import {
  isAiGrpcConfigured,
  processAiGrpcRequest,
  type AiProcessRequestInput,
} from "@/core/infra/grpc/ai-grpc.client";
import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { createOperationalError } from "@/middlewares/error-middleware";
import { env } from "@servexa-warranty-ai/env/server";
import { KnowledgeRetrievalService } from "@/modules/v1/ai/services/knowledge-retrieval.service";

const retrievalService = new KnowledgeRetrievalService();

async function augmentPromptWithRag(tenantId: string, prompt: string): Promise<string> {
  if (!env.AI_RAG_CONTEXT_ENABLED || !tenantId.trim()) {
    return prompt;
  }
  try {
    const chunks = await retrievalService.hybridSearch({
      tenantId,
      query: prompt,
      topK: env.AI_RAG_CONTEXT_TOP_K,
    });
    const block = retrievalService.formatAsPromptBlock(chunks);
    if (!block) return prompt;
    return `Use the following retrieved warranty knowledge when relevant. Cite bracket references like [#1] when you use a snippet.\n\n${block}\n\nUser:\n${prompt}`;
  } catch {
    return prompt;
  }
}

export type AiUnaryCompletionInput = {
  prompt: string;
  traceId: string;
  userId: string;
  tenantId: string;
  role: string;
  contextJson: string;
};

export type AiUnaryCompletionOptions = {
  /** When true, never falls back to Node Gemini (matches legacy `/v1/ai/query` behavior). */
  requireGrpc?: boolean;
  structuredSchema?: z.ZodTypeAny;
  allowFallbackToNode?: boolean;
};

export type AiUnaryCompletionResult = {
  text: string;
  metadataJson: string;
  backend: "grpc" | "gemini_node";
  retryable: boolean;
};

function classifyRetryable(error: unknown): boolean {
  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return msg.includes("deadline") || msg.includes("timeout") || msg.includes("unavailable");
}

/**
 * Shared "single prompt in / context out" path for `POST /ai` and `/v1/ai/query`.
 * Prefers Python gRPC when `AI_GRPC_HOST` is set; otherwise uses Gemini in Node unless `requireGrpc`.
 */
export async function completeUnaryPrompt(
  input: AiUnaryCompletionInput,
  options?: AiUnaryCompletionOptions,
): Promise<AiUnaryCompletionResult> {
  if (!input.prompt.trim()) {
    throw createOperationalError("Prompt must be non-empty", HTTP_RESPONSE_CODE.BAD_REQUEST);
  }

  const prompt = await augmentPromptWithRag(input.tenantId, input.prompt);

  const grpcPayload: AiProcessRequestInput = {
    message: prompt,
    traceId: input.traceId,
    userId: input.userId,
    tenantId: input.tenantId,
    role: input.role,
    contextJson: input.contextJson,
  };

  if (isAiGrpcConfigured()) {
    try {
      const out = await processAiGrpcRequest(grpcPayload);
      return {
        text: out.output,
        metadataJson: out.metadataJson,
        backend: "grpc",
        retryable: false,
      };
    } catch (error) {
      if (options?.requireGrpc || options?.allowFallbackToNode === false) {
        throw error;
      }
    }
  }

  if (options?.requireGrpc) {
    throw createOperationalError(
      "AI gRPC is not configured (set AI_GRPC_HOST)",
      HTTP_RESPONSE_CODE.SERVICE_UNAVAILABLE,
    );
  }

  const model = wrapLanguageModel({
    model: google("gemini-2.5-flash"),
    middleware: devToolsMiddleware(),
  });
  let text = "";
  let metadataJson = "{}";
  try {
    if (options?.structuredSchema) {
      const out = await generateText({
        model,
        prompt,
        output: Output.object({
          schema: options.structuredSchema,
        }),
      });
      text = JSON.stringify(out.output);
      metadataJson = JSON.stringify({
        modelId: out.response?.modelId ?? "gemini-2.5-flash",
        structured: true,
      });
    } else {
      const out = await generateText({
        model,
        prompt,
      });
      text = out.text;
      metadataJson = JSON.stringify({
        modelId: out.response?.modelId ?? "gemini-2.5-flash",
      });
    }
  } catch (error) {
    throw createOperationalError(
      classifyRetryable(error) ? "AI provider temporarily unavailable" : "AI provider request failed",
      HTTP_RESPONSE_CODE.BAD_GATEWAY,
      undefined,
      undefined,
      { retryable: classifyRetryable(error) },
    );
  }

  return {
    text,
    metadataJson,
    backend: "gemini_node",
    retryable: false,
  };
}
