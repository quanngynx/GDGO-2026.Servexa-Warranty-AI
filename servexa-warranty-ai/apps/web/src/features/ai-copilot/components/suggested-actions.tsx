import type { CopilotSuggestedAction } from "@servexa-warranty-ai/ai-contracts";

import { Button } from "@servexa-warranty-ai/ui/components/button";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";

import { SERVEXA_COPILOT_QUICK_PROMPT_EVENT } from "../constants";

export function dispatchCopilotActionPrompt(action: string): void {
  const body = action.startsWith("prompt:") ? action.slice("prompt:".length).trim() : action.trim();
  if (!body) return;
  window.dispatchEvent(new CustomEvent(SERVEXA_COPILOT_QUICK_PROMPT_EVENT, { detail: body }));
}

type SuggestedActionsPanelProps = {
  actions: CopilotSuggestedAction[] | undefined;
  className?: string;
};

export function SuggestedActionsPanel({ actions, className }: SuggestedActionsPanelProps) {
  if (!actions?.length) {
    return (
      <div className={cn("border-t border-border px-3 py-2 text-xs text-muted-foreground", className)}>
        Suggested actions will appear when the gateway returns structured recommendations.
      </div>
    );
  }

  return (
    <div className={cn("border-t border-border px-2 py-2", className)}>
      <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Suggested actions</p>
      <div className="flex flex-wrap gap-2 px-2 pb-1">
        {actions.map((a) => (
          <Button
            key={a.id}
            type="button"
            variant="secondary"
            size="sm"
            className="h-auto max-w-full whitespace-normal text-left text-xs"
            onClick={() => dispatchCopilotActionPrompt(a.action)}
          >
            {a.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
