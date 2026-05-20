import type { RunAgentInput } from "@ag-ui/client";

export function lastUserPrompt(messages: RunAgentInput["messages"]): string {
  if (!messages?.length) return " ";

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];

    if (!msg || msg.role !== "user") continue;
    const content = msg.content;

    if (typeof content === "string") {
      if (content.trim()) return content.trim();
    }

    if (Array.isArray(content)) {
      const text = content
        .map((part) => {
          if (part.type === "text") {
            return part.text;
          }
          return "";
        })
        .join("").trim();
      if (text.trim()) return text.trim();
    }
  }
  return " ";
}
