import { CopilotChat, useConfigureSuggestions } from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";
import type { CopilotEvidenceSource } from "@servexa-warranty-ai/ai-contracts";
import { useCallback, useMemo } from "react";

import { useCopilotMessageFeedback } from "../hooks/use-copilot-message-feedback";
import { createServexaCopilotAssistantMessage } from "./servexa-copilot-assistant-message";
import {
  ServexaCopilotChatInput,
  createServexaCopilotChatInput,
} from "./servexa-copilot-chat-input";
import { createServexaCopilotUserMessage } from "./servexa-copilot-user-message";
import { OperationalQuickPromptSuggestions } from "./operational-quick-prompt-suggestions";
import { useTranslation } from "react-i18next";

type ServexaCopilotChatLayout = "rail" | "fullPage";

type ServexaCopilotChatProps = {
  agentId: string;
  className?: string;
  layout?: ServexaCopilotChatLayout;
  sources?: CopilotEvidenceSource[];
  onChatError?: (message: string) => void;
  onRetryLast?: () => void | Promise<void>;
};

export function ServexaCopilotChat({
  agentId,
  className,
  layout = "rail",
  sources,
  onChatError,
  onRetryLast,
}: ServexaCopilotChatProps) {
    const { t } = useTranslation();
  useConfigureSuggestions(null);

  const { getMessageFeedback, setMessageFeedback } = useCopilotMessageFeedback();
  const isFullPage = layout === "fullPage";

  const onMessageFeedback = useCallback(
    (messageId: string, rating: "up" | "down") => {
      setMessageFeedback(messageId, rating);
    },
    [setMessageFeedback],
  );

  const inputSlot = useMemo(
    () =>
      isFullPage
        ? createServexaCopilotChatInput("fullPage")
        : ServexaCopilotChatInput,
    [isFullPage],
  );

  const messageView = useMemo(
    () => ({
      assistantMessage: createServexaCopilotAssistantMessage({
        onRetryLast,
        getMessageFeedback,
        onMessageFeedback,
        sources,
      }),
      userMessage: createServexaCopilotUserMessage(onRetryLast),
    }),
    [getMessageFeedback, onMessageFeedback, onRetryLast, sources],
  );

  const welcomeScreen = useCallback(
    ({ input }: { input: React.ReactNode; suggestionView: React.ReactNode }) => {
      if (isFullPage) {
        return (
          <div className="flex h-full min-h-0 flex-col items-center justify-center gap-8 px-4 py-10 sm:px-8">
            <div className="max-w-xl space-y-3 text-center">
              <p
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                translate="no"
              >
                {t("Servexa Warranty AI")}</p>
              <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                {t("How can I help with operations today?")}</h2>
              <p className="text-pretty text-sm text-muted-foreground sm:text-base">
                {t("Ask about repair cases, SLA risk, inventory, and approvals. Evidence and\n suggested actions appear in the context panel on the right.")}</p>
            </div>
            <div className="w-full max-w-xl space-y-4">{input}</div>
            <OperationalQuickPromptSuggestions className="w-full max-w-xl" />
          </div>
        );
      }

      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-3">
          <h2 className="text-balance text-center text-xl font-bold">
            {t("Welcome to the Servexa Warranty AI")}</h2>
          {input}
          <OperationalQuickPromptSuggestions />
        </div>
      );
    },
    [isFullPage],
  );

  return (
    <CopilotChat
      agentId={agentId}
      messageView={messageView}
      welcomeScreen={welcomeScreen}
      labels={{
        chatInputPlaceholder: isFullPage
          ? "Ask about cases, SLA risk, or inventory…"
          : "Ask me anything…",
        assistantMessageToolbarThumbsUpLabel: "Good response",
        assistantMessageToolbarThumbsDownLabel: "Bad response",
      }}
      className={className}
      input={inputSlot}
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
