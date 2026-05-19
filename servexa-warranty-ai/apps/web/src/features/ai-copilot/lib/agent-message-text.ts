import type { AbstractAgent, Message } from "@ag-ui/client";

// Use TypeScript's Extract utility to separate the type of the "user" message
type UserMessageContent = Extract<Message, { role: "user" }>["content"];

export function stringifyAgentMessageContent(content: UserMessageContent): string {
  if (!content) return "";
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (part.type === "text") {
          return part.text;
        }
        // Skip image, audio, video, document, binary
        return "";
      })
      .join("");
  }
  return "";
}

export function getLastUserMessageText(agent: AbstractAgent | null | undefined): string {
  const messages = agent?.messages;
  if (!Array.isArray(messages) || messages.length === 0) return "";

  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (!m || m.role !== "user") continue;
    return stringifyAgentMessageContent(m.content).trim();
  }
  return "";
}
