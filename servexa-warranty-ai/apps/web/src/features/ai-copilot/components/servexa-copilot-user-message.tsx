import {
  CopilotChatUserMessage,
  type CopilotChatUserMessageProps,
  useAgent,
  useCopilotChatConfiguration,
} from "@copilotkit/react-core/v2";
import { Repeat1 } from "lucide-react";

const RETRY_TOOLTIP = "retry last message";

function ServexaRetryToolbarButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  return (
    <CopilotChatUserMessage.ToolbarButton
      data-testid="copilot-retry-last-message-button"
      title={RETRY_TOOLTIP}
      onClick={onClick}
    >
      <Repeat1 className="cpk:size-[18px]" />
    </CopilotChatUserMessage.ToolbarButton>
  );
}

type ServexaCopilotUserMessageProps = CopilotChatUserMessageProps & {
  onRetryLast?: () => void | Promise<void>;
};

function ServexaCopilotUserMessageInner({
  message,
  onRetryLast,
  ...props
}: ServexaCopilotUserMessageProps) {
  const config = useCopilotChatConfiguration();
  const { agent } = useAgent({ agentId: config?.agentId ?? "default" });
  const messages = agent.messages;
  const lastMessage = messages[messages.length - 1];
  const isLastMessage = lastMessage?.id === message.id;
  const lastMessageIsUser = lastMessage?.role === "user";

  const showRetry = Boolean(onRetryLast && isLastMessage && lastMessageIsUser);

  return (
    <CopilotChatUserMessage
      {...props}
      message={message}
      additionalToolbarItems={
        showRetry ? (
          <ServexaRetryToolbarButton
            onClick={() => {
              void onRetryLast?.();
            }}
          />
        ) : undefined
      }
    />
  );
}

export function createServexaCopilotUserMessage(
  onRetryLast?: () => void | Promise<void>,
): typeof CopilotChatUserMessage {
  function ServexaCopilotUserMessage(props: CopilotChatUserMessageProps) {
    return <ServexaCopilotUserMessageInner {...props} onRetryLast={onRetryLast} />;
  }

  ServexaCopilotUserMessage.Container = CopilotChatUserMessage.Container;
  ServexaCopilotUserMessage.MessageRenderer = CopilotChatUserMessage.MessageRenderer;
  ServexaCopilotUserMessage.Toolbar = CopilotChatUserMessage.Toolbar;
  ServexaCopilotUserMessage.ToolbarButton = CopilotChatUserMessage.ToolbarButton;
  ServexaCopilotUserMessage.CopyButton = CopilotChatUserMessage.CopyButton;
  ServexaCopilotUserMessage.EditButton = CopilotChatUserMessage.EditButton;
  ServexaCopilotUserMessage.BranchNavigation = CopilotChatUserMessage.BranchNavigation;

  return ServexaCopilotUserMessage as typeof CopilotChatUserMessage;
}
