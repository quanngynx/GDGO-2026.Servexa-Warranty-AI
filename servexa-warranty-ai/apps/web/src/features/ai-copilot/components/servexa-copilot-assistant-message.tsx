import {
  CopilotChatAssistantMessage,
  type CopilotChatAssistantMessageProps,
} from "@copilotkit/react-core/v2";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import { Repeat1, ThumbsDown, ThumbsUp } from "lucide-react";
import type { ComponentProps } from "react";

import type { CopilotMessageFeedbackRating } from "../hooks/use-copilot-message-feedback";

const RETRY_TOOLTIP = "retry last message";

function ServexaRetryRegenerateButton({
  onClick,
}: Pick<ComponentProps<typeof CopilotChatAssistantMessage.RegenerateButton>, "onClick">) {
  return (
    <CopilotChatAssistantMessage.ToolbarButton
      data-testid="copilot-regenerate-button"
      title={RETRY_TOOLTIP}
      onClick={onClick}
    >
      <Repeat1 className="cpk:size-[18px]" />
    </CopilotChatAssistantMessage.ToolbarButton>
  );
}

function ServexaThumbsUpButton({
  onClick,
  active,
}: Pick<ComponentProps<typeof CopilotChatAssistantMessage.ThumbsUpButton>, "onClick"> & {
  active?: boolean;
}) {
  return (
    <CopilotChatAssistantMessage.ToolbarButton
      data-testid="copilot-thumbs-up-button"
      title="Good response"
      onClick={onClick}
      aria-pressed={active}
    >
      <ThumbsUp className={cn("cpk:size-[18px]", active && "cpk:fill-current")} />
    </CopilotChatAssistantMessage.ToolbarButton>
  );
}

function ServexaThumbsDownButton({
  onClick,
  active,
}: Pick<ComponentProps<typeof CopilotChatAssistantMessage.ThumbsDownButton>, "onClick"> & {
  active?: boolean;
}) {
  return (
    <CopilotChatAssistantMessage.ToolbarButton
      data-testid="copilot-thumbs-down-button"
      title="Bad response"
      onClick={onClick}
      aria-pressed={active}
    >
      <ThumbsDown className={cn("cpk:size-[18px]", active && "cpk:fill-current")} />
    </CopilotChatAssistantMessage.ToolbarButton>
  );
}

export type ServexaCopilotAssistantMessageOptions = {
  onRetryLast?: () => void | Promise<void>;
  getMessageFeedback?: (messageId: string) => CopilotMessageFeedbackRating | undefined;
  onMessageFeedback?: (
    messageId: string,
    rating: CopilotMessageFeedbackRating,
  ) => void;
};

type ServexaCopilotAssistantMessageProps = CopilotChatAssistantMessageProps &
  ServexaCopilotAssistantMessageOptions;

function ServexaCopilotAssistantMessageInner({
  message,
  messages,
  onRetryLast,
  getMessageFeedback,
  onMessageFeedback,
  ...props
}: ServexaCopilotAssistantMessageProps) {
  const isLatestAssistant =
    message.role === "assistant" &&
    messages?.[messages.length - 1]?.id === message.id;

  const showRetry = Boolean(isLatestAssistant && onRetryLast);
  const feedback = getMessageFeedback?.(message.id);
  const showFeedback = Boolean(onMessageFeedback);

  return (
    <CopilotChatAssistantMessage
      {...props}
      message={message}
      messages={messages}
      onRegenerate={
        showRetry
          ? () => {
              void onRetryLast?.();
            }
          : undefined
      }
      regenerateButton={showRetry ? ServexaRetryRegenerateButton : undefined}
      onThumbsUp={
        showFeedback
          ? () => {
              onMessageFeedback?.(message.id, "up");
            }
          : undefined
      }
      onThumbsDown={
        showFeedback
          ? () => {
              onMessageFeedback?.(message.id, "down");
            }
          : undefined
      }
      thumbsUpButton={
        showFeedback
          ? (slotProps) => (
              <ServexaThumbsUpButton {...slotProps} active={feedback === "up"} />
            )
          : undefined
      }
      thumbsDownButton={
        showFeedback
          ? (slotProps) => (
              <ServexaThumbsDownButton {...slotProps} active={feedback === "down"} />
            )
          : undefined
      }
    />
  );
}

export function createServexaCopilotAssistantMessage(
  options: ServexaCopilotAssistantMessageOptions = {},
): typeof CopilotChatAssistantMessage {
  function ServexaCopilotAssistantMessage(props: CopilotChatAssistantMessageProps) {
    return <ServexaCopilotAssistantMessageInner {...props} {...options} />;
  }

  ServexaCopilotAssistantMessage.MarkdownRenderer =
    CopilotChatAssistantMessage.MarkdownRenderer;
  ServexaCopilotAssistantMessage.Toolbar = 
    CopilotChatAssistantMessage.Toolbar;
  ServexaCopilotAssistantMessage.ToolbarButton =
    CopilotChatAssistantMessage.ToolbarButton;
  ServexaCopilotAssistantMessage.CopyButton = 
    CopilotChatAssistantMessage.CopyButton;
  ServexaCopilotAssistantMessage.ThumbsUpButton =
    CopilotChatAssistantMessage.ThumbsUpButton;
  ServexaCopilotAssistantMessage.ThumbsDownButton =
    CopilotChatAssistantMessage.ThumbsDownButton;
  ServexaCopilotAssistantMessage.ReadAloudButton =
    CopilotChatAssistantMessage.ReadAloudButton;
  ServexaCopilotAssistantMessage.RegenerateButton =
    CopilotChatAssistantMessage.RegenerateButton;

  return ServexaCopilotAssistantMessage as typeof CopilotChatAssistantMessage;
}
