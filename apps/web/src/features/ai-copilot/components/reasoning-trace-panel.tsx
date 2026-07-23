import type {
  ReasoningTrace,
  ReasoningTraceEvent,
} from "@servexa-warranty-ai/ai-contracts";

import { Sparkles } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@servexa-warranty-ai/ui/components/collapsible";

import { cn } from "@servexa-warranty-ai/ui/lib/utils";

import { ReasoningTraceTimeline } from "./reasoning-trace-timeline";
import { useTranslation } from "react-i18next";

type ReasoningTracePanelProps = {
  reasoningTrace?: ReasoningTrace;
  latestReasoningEvent?: ReasoningTraceEvent;
  className?: string;
};

export function ReasoningTracePanel({
  reasoningTrace,
  latestReasoningEvent,
  className,
}: ReasoningTracePanelProps) {
    const { t } = useTranslation();
  const hasAny =
    Boolean(reasoningTrace?.events?.length) ||
    Boolean(latestReasoningEvent && reasoningTrace?.events?.some((e) => e.id === latestReasoningEvent.id));

  return (
    <Collapsible
      defaultOpen
      className={cn("border-t border-border px-2 py-2", className)}
    >
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium hover:bg-muted">
        <Sparkles className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        {t("Reasoning trace")}</CollapsibleTrigger>

      <CollapsibleContent className="px-2 pb-2 pt-1">
        {reasoningTrace?.events?.length ? (
          <ReasoningTraceTimeline
            trace={reasoningTrace}
            latestReasoningEvent={latestReasoningEvent}
          />
        ) : hasAny ? (
          <p className="px-1 pb-2 text-xs text-muted-foreground">
            {t("Latest step is available, but the full trace is not yet populated.")}</p>
        ) : (
          <p className="px-1 pb-2 text-xs text-muted-foreground">
            {t("No reasoning trace available yet.")}</p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

