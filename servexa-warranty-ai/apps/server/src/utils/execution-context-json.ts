import { type RunAgentInput } from "@ag-ui/client";

export function executionContextJson(input: RunAgentInput): string {
  const ctx = input.context ?? input.forwardedProps;
  if (ctx && typeof ctx === "object") {
    try {
      return JSON.stringify(ctx);
    } catch {
      return "{}";
    }
  }
  return "{}";
}
