import { Button } from "@servexa-warranty-ai/ui/components/button";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";

import { SERVEXA_COPILOT_QUICK_PROMPT_EVENT } from "../constants";

export type QuickPromptItem = { title: string; message: string };

/** Operational presets aligned with Phase 1 proposal (Step 3). */
export const OPERATIONAL_QUICK_PROMPTS: QuickPromptItem[] = [
  { title: "Summarize case", message: "Summarize this repair case for a technician handoff." },
  { title: "Similar failures", message: "Find similar repair failures and likely root causes." },
  { title: "Warranty eligibility", message: "Explain warranty eligibility for the current context." },
  { title: "SLA risk", message: "Detect SLA risk for this repair case." },
  { title: "Manuals", message: "Search technical manuals relevant to this situation." },
  { title: "Next action", message: "Suggest the next operational action for this case." },
  { title: "Supply chain", message: "Detect supply chain risk for parts on this case." },
];

type QuickPromptGridProps = {
  className?: string;
};

export function QuickPromptGrid({ className }: QuickPromptGridProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5 border-b border-border px-2 py-2", className)}>
      {OPERATIONAL_QUICK_PROMPTS.map((p) => (
        <Button
          key={p.title}
          type="button"
          variant="outline"
          size="sm"
          className="h-auto max-w-[48%] flex-1 whitespace-normal px-2 py-1.5 text-[11px] leading-snug sm:max-w-none sm:flex-none"
          onClick={() =>
            window.dispatchEvent(new CustomEvent(SERVEXA_COPILOT_QUICK_PROMPT_EVENT, { detail: p.message }))
          }
        >
          {p.title}
        </Button>
      ))}
    </div>
  );
}
