import type { UIMessage } from "ai";
import { createUIMessageStream, streamText, simulateReadableStream } from "ai";
import { MockLanguageModelV3 } from "ai/test";

/**
 * Wraps a deterministic gRPC answer as a UI message stream compatible with {@link DefaultChatTransport}.
 */
export function createGrpcAnswerUIMessageStream(parms: {
  originalMessages: UIMessage[];
  assistantText: string;
}) {
  const { originalMessages, assistantText } = parms;

  return createUIMessageStream({
    originalMessages,
    execute: async ({ writer }) => {
      const model = new MockLanguageModelV3({
        doStream: async () => ({
          stream: simulateReadableStream({
            initialDelayInMs: 0,
            chunkDelayInMs: 0,
            chunks: [
              {
                type: "text-delta",
                id: "grpc-assistant",
                delta: assistantText,
              },
            ],
          }),
        }),
      });

      const result = streamText({
        model,
        prompt: " ",
      });

      writer.merge(
        result.toUIMessageStream({
          sendReasoning: false,
        }),
      );
    },
  });
}
