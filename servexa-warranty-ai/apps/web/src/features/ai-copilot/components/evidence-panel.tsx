import type { CopilotEvidenceSource } from "@servexa-warranty-ai/ai-contracts";
import { FileText } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@servexa-warranty-ai/ui/components/collapsible";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";

type EvidencePanelProps = {
  sources: CopilotEvidenceSource[] | undefined;
  /** Source IDs referenced by pending HITL cards (highlighted in the list). */
  highlightedSourceIds?: string[];
  className?: string;
};

const typeLabel: Record<CopilotEvidenceSource["type"], string> = {
  manual: "Manual",
  repair_case: "Case",
  policy: "Policy",
  inventory: "Inventory",
};

export function EvidencePanel({
  sources,
  highlightedSourceIds,
  className,
}: EvidencePanelProps) {
  const hasSources = sources && sources.length > 0;
  const highlightSet = new Set(highlightedSourceIds ?? []);

  return (
    <Collapsible defaultOpen className={cn("border-t border-border px-2 py-2", className)}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium hover:bg-muted">
        <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        Evidence and sources
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 px-2 pb-2 text-xs text-muted-foreground">
        {!hasSources ? (
          <p>
            No structured citations were returned for this turn. When RAG is enabled on the gateway,
            sources will appear here.
          </p>
        ) : (
          <ul className="space-y-2">
            {sources!.map((s) => (
              <li
                key={s.id}
                className={cn(
                  "rounded-md border border-border/60 bg-muted/30 p-2",
                  highlightSet.has(s.id) && "border-amber-500/50 bg-amber-500/10",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">{s.title}</span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
                    {typeLabel[s.type]}
                  </span>
                </div>
                {s.excerpt ? <p className="mt-1 text-muted-foreground">{s.excerpt}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
