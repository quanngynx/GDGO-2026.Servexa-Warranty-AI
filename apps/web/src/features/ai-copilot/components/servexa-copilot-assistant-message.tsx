import {
  CopilotChatAssistantMessage,
  type CopilotChatAssistantMessageProps,
} from "@copilotkit/react-core/v2";
import type { CopilotEvidenceSource } from "@servexa-warranty-ai/ai-contracts";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import { BookOpen, Ellipsis, Volume2, Repeat1, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ComponentProps } from "react";

import type { CopilotMessageFeedbackRating } from "../hooks/use-copilot-message-feedback";
import {
  SERVEXA_COPILOT_READ_MESSAGE_EVENT,
} from "../constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@servexa-warranty-ai/ui/components/dropdown-menu";
import { EvidenceSourcesList } from "./evidence-sources-list";
import { RETRY_TOOLTIP } from "@/constants";
import { useTranslation } from "react-i18next";

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~>#-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readAloud(text: string): void {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  const cleaned = stripMarkdown(text);
  if (!cleaned) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(cleaned);
    window.speechSynthesis.speak(utter);
  } catch {
    // ignore
  }
}

function SourceMenuItem({ sources }: { sources: CopilotEvidenceSource[] | undefined }) {
    const { t } = useTranslation();
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <DropdownMenuItem
      onSelect={(event) => event.preventDefault()}
      onPointerEnter={() => setPreviewOpen(true)}
      onPointerLeave={() => setPreviewOpen(false)}
      onFocus={() => setPreviewOpen(true)}
      onBlur={() => setPreviewOpen(false)}
      className="relative"
    >
      <BookOpen className="size-3.5 shrink-0" />
      {t("Source")}{previewOpen ? (
        <div
          role="tooltip"
          aria-label="Evidence and sources"
          className="pointer-events-auto absolute top-0 right-full z-200 mr-2 w-64 rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md"
          onPointerEnter={() => setPreviewOpen(true)}
          onPointerLeave={() => setPreviewOpen(false)}
        >
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {t("Evidence and sources")}</p>
          <EvidenceSourcesList sources={sources} />
        </div>
      ) : null}
    </DropdownMenuItem>
  );
}

function ServexaAssistantOtherActions({
  messageText,
  sources,
}: {
  messageText: string;
  sources: CopilotEvidenceSource[] | undefined;
}) {
    const { t } = useTranslation();
  useEffect(() => {
    const onRead = (event: Event) => {
      const detail = (event as CustomEvent<{ text?: string }>).detail;
      const text = detail?.text ?? messageText;
      readAloud(text);
    };
    window.addEventListener(SERVEXA_COPILOT_READ_MESSAGE_EVENT, onRead as EventListener);
    return () =>
      window.removeEventListener(SERVEXA_COPILOT_READ_MESSAGE_EVENT, onRead as EventListener);
  }, [messageText]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <CopilotChatAssistantMessage.ToolbarButton title={t("Other actions")}>
          <Ellipsis className="cpk:size-[18px]" />
        </CopilotChatAssistantMessage.ToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="overflow-visible">
        <SourceMenuItem sources={sources} />
        <DropdownMenuItem
          onSelect={() => {
            window.dispatchEvent(
              new CustomEvent(SERVEXA_COPILOT_READ_MESSAGE_EVENT, { detail: { text: messageText } }),
            );
            readAloud(messageText);
          }}
        >
          <Volume2 />
          {t("Read")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ServexaRetryRegenerateButton({
  onClick,
}: Pick<ComponentProps<typeof CopilotChatAssistantMessage.RegenerateButton>, "onClick">) {
    const { t } = useTranslation();
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
    const { t } = useTranslation();
  return (
    <CopilotChatAssistantMessage.ToolbarButton
      data-testid="copilot-thumbs-up-button"
      title={t("Good response")}
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
    const { t } = useTranslation();
  return (
    <CopilotChatAssistantMessage.ToolbarButton
      data-testid="copilot-thumbs-down-button"
      title={t("Bad response")}
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
  sources?: CopilotEvidenceSource[];
};

type ServexaCopilotAssistantMessageProps = CopilotChatAssistantMessageProps &
  ServexaCopilotAssistantMessageOptions;

function ServexaCopilotAssistantMessageInner({
  message,
  messages,
  onRetryLast,
  getMessageFeedback,
  onMessageFeedback,
  sources,
  ...props
}: ServexaCopilotAssistantMessageProps) {
    const { t } = useTranslation();
  const isLatestAssistant =
    message.role === "assistant" &&
    messages?.[messages.length - 1]?.id === message.id;

  const showRetry = Boolean(isLatestAssistant && onRetryLast);
  const feedback = getMessageFeedback?.(message.id);
  const showFeedback = Boolean(onMessageFeedback);
  const messageText = useMemo(() => message.content ?? "", [message.content]);

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
      additionalToolbarItems={
        <ServexaAssistantOtherActions messageText={messageText} sources={sources} />
      }
    />
  );
}

export function createServexaCopilotAssistantMessage(
  options: ServexaCopilotAssistantMessageOptions = {},
): typeof CopilotChatAssistantMessage {
  function ServexaCopilotAssistantMessage(props: CopilotChatAssistantMessageProps) {
      const { t } = useTranslation();
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
