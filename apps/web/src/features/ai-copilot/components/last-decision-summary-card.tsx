import type { CopilotRailMetadata, HitlRequest } from "@servexa-warranty-ai/ai-contracts";
import { CheckCircle2 } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@servexa-warranty-ai/ui/components/collapsible";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import { useTranslation } from "react-i18next";

type LastDecisionSummaryCardProps = {
  lastDecision: HitlRequest | CopilotRailMetadata["lastDecision"];
  className?: string;
};

function formatDecision(
  lastDecision: HitlRequest | NonNullable<CopilotRailMetadata["lastDecision"]>,
): string {
  if ("kind" in lastDecision && typeof lastDecision.kind === "string" && lastDecision.kind) {
    return `${lastDecision.kind} — ${lastDecision.status}`;
  }
  if ("decision" in lastDecision && lastDecision.decision) {
    return `${lastDecision.decision} — ${lastDecision.status}`;
  }
  return String(lastDecision.status);
}

export function LastDecisionSummaryCard({ lastDecision, className }: LastDecisionSummaryCardProps) {
    const { t } = useTranslation();
  if (!lastDecision) return null;

  const summary =
    "summary" in lastDecision && lastDecision.summary
      ? lastDecision.summary
      : formatDecision(lastDecision);

  return (
    <Collapsible defaultOpen className={cn("border-t border-border px-2 py-2", className)}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium hover:bg-muted">
        <CheckCircle2 className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        {t("Last decision")}</CollapsibleTrigger>
      <CollapsibleContent className="px-2 pb-2 text-xs text-muted-foreground">
        <p>{summary}</p>
      </CollapsibleContent>
    </Collapsible>
  );
}
