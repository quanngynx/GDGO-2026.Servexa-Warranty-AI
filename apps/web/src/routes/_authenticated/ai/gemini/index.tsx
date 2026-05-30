import { createFileRoute } from "@tanstack/react-router";

import { AICopilotFullPage } from "@/features/ai-copilot/ai-copilot-full-page";

export const Route = createFileRoute("/_authenticated/ai/gemini/")({
  beforeLoad: () => ({ title: "Operations Intelligence" }),
  component: AICopilotFullPage,
});
