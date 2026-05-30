import type {
  ReasoningTrace,
  ReasoningTraceEvent,
} from "@servexa-warranty-ai/ai-contracts";

import { cn } from "@servexa-warranty-ai/ui/lib/utils";

import { ReasoningTraceStepCard } from "./reasoning-trace-step-card";

type ReasoningTraceTimelineProps = {
  trace: ReasoningTrace;
  latestReasoningEvent?: ReasoningTraceEvent;
  className?: string;
};

function eventSortRank(e: ReasoningTraceEvent) {
  const ms = Date.parse(e.endedAt ?? e.startedAt ?? "");
  return Number.isNaN(ms) ? 0 : ms;
}

export function ReasoningTraceTimeline({
  trace,
  latestReasoningEvent,
  className,
}: ReasoningTraceTimelineProps) {
  const events = trace.events.toSorted((a, b) => eventSortRank(a) - eventSortRank(b));

  return (
    <ol className={cn("space-y-2", className)} aria-label="Reasoning trace timeline">
      {events.map((event) => (
        <ReasoningTraceStepCard
          key={event.id}
          step={event}
          isLatest={latestReasoningEvent ? event.id === latestReasoningEvent.id : false}
        />
      ))}
    </ol>
  );
}

