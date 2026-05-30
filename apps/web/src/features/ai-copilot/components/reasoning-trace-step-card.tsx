import type { ReasoningTraceEvent } from "@servexa-warranty-ai/ai-contracts";

import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import { formatIsoShort } from "@servexa-warranty-ai/ui/lib/format-time";

import { ReasoningTraceStatusBadge } from "./reasoning-trace-status-badge";
import { ReasoningTraceStepIcon } from "./reasoning-trace-step-icon";

type ReasoningTraceStepCardProps = {
  step: ReasoningTraceEvent;
  isLatest?: boolean;
};

function safeDetailValue(v: unknown) {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    const s = JSON.stringify(v);
    return s.length > 200 ? `${s.slice(0, 200)}...` : s;
  } catch {
    return String(v);
  }
}

export function ReasoningTraceStepCard({
  step,
  isLatest,
}: ReasoningTraceStepCardProps) {
  const started = formatIsoShort(step.startedAt);
  const ended = formatIsoShort(step.endedAt);

  const detailEntries = step.safeDetails
    ? Object.entries(step.safeDetails).slice(0, 4)
    : [];

  return (
    <li
      className={cn(
        "rounded-md border bg-background px-2 py-2",
        isLatest && "border-primary/60 shadow-sm",
      )}
      aria-label={`Reasoning step: ${step.title}`}
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5">
          <ReasoningTraceStepIcon
            type={step.type}
            className={cn("text-muted-foreground", isLatest && "text-primary")}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <ReasoningTraceStatusBadge status={step.status} />
            {isLatest ? (
              <span className="text-[11px] font-medium text-primary">
                Latest
              </span>
            ) : null}
            <span className="text-[11px] text-muted-foreground">
              {step.type}
            </span>
          </div>

          <p className="mt-1 truncate text-sm font-medium">{step.title}</p>

          <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {step.summary}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            {started ? <span>Started: {started}</span> : null}
            {ended ? <span>Ended: {ended}</span> : null}
            {step.durationMs !== undefined ? (
              <span>Duration: {step.durationMs}ms</span>
            ) : null}
          </div>

          {step.status === "failed" && step.errorMessage ? (
            <p className="mt-2 text-xs font-medium text-destructive">
              {step.errorMessage}
            </p>
          ) : null}

          {detailEntries.length > 0 ? (
            <div className="mt-2 space-y-1">
              {detailEntries.map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-start justify-between gap-2 text-[11px]"
                >
                  <span className="shrink-0 text-muted-foreground">
                    {k}
                  </span>
                  <span className="min-w-0 truncate text-foreground/90">
                    {safeDetailValue(v)}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

