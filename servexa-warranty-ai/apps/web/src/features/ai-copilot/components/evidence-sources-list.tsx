import type { CopilotEvidenceSource } from "@servexa-warranty-ai/ai-contracts";

import { cn } from "@servexa-warranty-ai/ui/lib/utils";

const typeLabel: Record<CopilotEvidenceSource["type"], string> = {
  manual: "Manual",
  repair_case: "Case",
  policy: "Policy",
  inventory: "Inventory",
};

type EvidenceSourcesListProps = {
  sources: CopilotEvidenceSource[] | undefined;
  highlightedSourceIds?: string[];
  className?: string;
  emptyMessage?: string;
};

export function EvidenceSourcesList({
  sources,
  highlightedSourceIds,
  className,
  emptyMessage = "No structured citations were returned for this turn.",
}: EvidenceSourcesListProps) {
  const hasSources = sources && sources.length > 0;
  const highlightSet = new Set(highlightedSourceIds ?? []);

  if (!hasSources) {
    return <p className={cn("text-xs text-muted-foreground", className)}>{emptyMessage}</p>;
  }

  return (
    <ul className={cn("space-y-2", className)}>
      {sources.map((s) => (
        <li
          key={s.id}
          className={cn(
            "rounded-md border border-border/60 bg-muted/30 p-2",
            highlightSet.has(s.id) && "border-amber-500/50 bg-amber-500/10",
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-foreground">{s.title}</span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
              {typeLabel[s.type]}
            </span>
          </div>
          {s.excerpt ? (
            <p className="mt-1 text-xs text-muted-foreground">{s.excerpt}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
