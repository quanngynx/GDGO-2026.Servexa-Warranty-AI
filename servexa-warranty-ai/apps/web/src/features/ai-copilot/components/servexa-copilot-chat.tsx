import { CopilotChat } from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";
import { useCallback, useMemo } from "react";

import { useCopilotMessageFeedback } from "../hooks/use-copilot-message-feedback";
import { createServexaCopilotAssistantMessage } from "./servexa-copilot-assistant-message";
import { createServexaCopilotUserMessage } from "./servexa-copilot-user-message";

type ServexaCopilotChatProps = {
  agentId: string;
  className?: string;
  onChatError?: (message: string) => void;
  onRetryLast?: () => void | Promise<void>;
};

function CustomDisclaimer(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className="text-xs text-gray-500">
      Powered by Servexa Warranty AI. Responses may contain errors.
    </div>
  );
}

export function ServexaCopilotChat({
  agentId,
  className,
  onChatError,
  onRetryLast,
}: ServexaCopilotChatProps) {
  const { getMessageFeedback, setMessageFeedback } = useCopilotMessageFeedback();

  const onMessageFeedback = useCallback(
    (messageId: string, rating: "up" | "down") => {
      setMessageFeedback(messageId, rating);
    },
    [setMessageFeedback],
  );

  const messageView = useMemo(
    () => ({
      assistantMessage: createServexaCopilotAssistantMessage({
        onRetryLast,
        getMessageFeedback,
        onMessageFeedback,
      }),
      userMessage: createServexaCopilotUserMessage(onRetryLast),
    }),
    [getMessageFeedback, onMessageFeedback, onRetryLast],
  );

  return (
    <CopilotChat
      agentId={agentId}
      messageView={messageView}
      welcomeScreen={({ input, suggestionView }) => (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <h1 className="text-xl font-bold">Welcome to the Servexa Warranty AI</h1>
          {input}
          {suggestionView}
        </div>
      )}
      labels={{
        chatInputPlaceholder: "Ask me anything...",
        assistantMessageToolbarThumbsUpLabel: "Good response",
        assistantMessageToolbarThumbsDownLabel: "Bad response",
      }}
      className={className}
      input={{ disclaimer: CustomDisclaimer }}
      autoScroll="pin-to-bottom"
      onError={(event) => {
        if (event && typeof event === "object" && "error" in event) {
          const err = event.error;
          onChatError?.(err.message);
        }
      }}
    />
  );
}
