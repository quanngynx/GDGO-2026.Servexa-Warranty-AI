import { type RunAgentInput } from "@ag-ui/client";

import { flattenCopilotContext } from "./flatten-copilot-context";

export function executionContextJson(input: RunAgentInput): string {
  const ctx = input.context ?? input.forwardedProps;
  if (ctx && typeof ctx === "object") {
    try {
      return JSON.stringify(flattenCopilotContext(ctx));
    } catch {
      return "{}";
    }
  }
  return "{}";
}
