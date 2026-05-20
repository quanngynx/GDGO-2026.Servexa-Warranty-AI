import { useCallback, useState } from "react";

export type CopilotMessageFeedbackRating = "up" | "down";

export function useCopilotMessageFeedback() {
  const [feedbackByMessageId, setFeedbackByMessageId] = useState<
    Record<string, CopilotMessageFeedbackRating>
  >({});

  const getMessageFeedback = useCallback(
    (messageId: string) => feedbackByMessageId[messageId],
    [feedbackByMessageId],
  );

  const setMessageFeedback = useCallback(
    (messageId: string, rating: CopilotMessageFeedbackRating) => {
      setFeedbackByMessageId((prev) => {
        if (prev[messageId] === rating) {
          const next = { ...prev };
          delete next[messageId];
          return next;
        }
        return { ...prev, [messageId]: rating };
      });
    },
    [],
  );

  return { getMessageFeedback, setMessageFeedback };
}
