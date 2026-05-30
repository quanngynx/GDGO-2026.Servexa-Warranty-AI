/** Must match `SERVEXA_COPILOT_AGENT_ID` in apps/server copilotkit module. */
export const SERVEXA_COPILOT_AGENT_ID = "operations_intelligence";

export const SERVEXA_COPILOT_QUICK_PROMPT_EVENT = "servexa:copilot-quick-prompt";

export const SERVEXA_COPILOT_READ_MESSAGE_EVENT = "servexa:copilot-read-message";

/** Routes that render a full-page AI experience; hide the right-rail copilot. */
export function isCopilotRailHiddenRoute(pathname: string): boolean {
  return pathname === "/ai/gemini" || pathname.startsWith("/ai/gemini/");
}
