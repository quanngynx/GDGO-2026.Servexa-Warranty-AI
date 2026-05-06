import { devToolsMiddleware } from "@ai-sdk/devtools";
import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
  wrapLanguageModel,
} from "ai";

import type {
  NextFunction,
  Request,
  RequestHandler,
  Response as ExpressResponse,
} from "express";

import { processAiGrpcRequest, isAiGrpcConfigured } from "@/core/infra/grpc/ai-grpc.client";

import { createGrpcAnswerUIMessageStream } from "./grpc-ui-message-stream";
import { pipeAiWebResponseToExpress } from "./pipe-web-ai-response";

function extractLastUserText(messages: UIMessage[]): string {
  const last = [...messages].reverse().find((m) => m.role === "user");
  if (!last) {
    return " ";
  }
  let text = "";
  for (const part of last.parts ?? []) {
    if (part.type === "text") {
      text += part.text;
    }
  }
  return text.trim() || " ";
}

/**
 * `POST /ai` — uses Python gRPC when `AI_GRPC_HOST` is set; otherwise streams via Gemini in Node.
 */
export const handleBootstrapAiChat: RequestHandler = async (
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const { messages = [] } = (req.body || {}) as { messages: UIMessage[] };

    if (isAiGrpcConfigured()) {
      const prompt = extractLastUserText(messages);
      const grpcOut = await processAiGrpcRequest({
        message: prompt,
        traceId: req.requestId ?? "trace-unknown",
        userId: req.user?.id ?? "anonymous",
        tenantId: "",
        role: req.user?.role ? String(req.user.role) : "",
        contextJson: JSON.stringify({ source: "post:/ai" }),
      });

      const stream = createGrpcAnswerUIMessageStream({
        originalMessages: messages,
        assistantText: grpcOut.output,
      });
      const web = createUIMessageStreamResponse({ stream });
      pipeAiWebResponseToExpress(web, res);
      return;
    }

    const model = wrapLanguageModel({
      model: google("gemini-2.5-flash"),
      middleware: devToolsMiddleware(),
    });
    const result = streamText({
      model,
      messages: await convertToModelMessages(messages),
    });
    result.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    next(error);
  }
};
