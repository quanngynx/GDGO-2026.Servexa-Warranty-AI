import { Button } from "@servexa-warranty-ai/ui/components/button";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";

import { SERVEXA_COPILOT_QUICK_PROMPT_EVENT } from "../constants";
import { OPERATIONAL_QUICK_PROMPTS } from "../operational-quick-prompts";

type OperationalQuickPromptSuggestionsProps = {
  className?: string;
};

export function OperationalQuickPromptSuggestions({
  className,
}: OperationalQuickPromptSuggestionsProps) {
  return (
    <div
      data-testid="copilot-suggestions"
      className={cn(
        "flex flex-wrap items-center justify-center gap-1.5 sm:gap-2",
        className,
      )}
    >
      {OPERATIONAL_QUICK_PROMPTS.map((prompt) => (
        <Button
          key={prompt.title}
          type="button"
          variant="outline"
          size="sm"
          className="h-auto whitespace-normal px-2.5 py-1.5 text-xs leading-snug"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent(SERVEXA_COPILOT_QUICK_PROMPT_EVENT, { detail: prompt.message }),
            )
          }
        >
          {prompt.title}
        </Button>
      ))}
    </div>
  );
}
