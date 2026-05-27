import type { ReasoningTraceEvent } from "@servexa-warranty-ai/ai-contracts";

import { Loader2 } from "lucide-react";

import { cn } from "@servexa-warranty-ai/ui/lib/utils";

type ReasoningTraceStatusBadgeProps = {
  status: ReasoningTraceEvent["status"];
};

function statusLabel(status: ReasoningTraceEvent["status"]) {
  if (status === "waiting_for_human") return "Waiting for human";
  return status.replaceAll("_", " ");
}

export function ReasoningTraceStatusBadge({
  status,
}: ReasoningTraceStatusBadgeProps) {
  if (status === "running" || status === "pending") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-md border bg-primary/10 px-1.5 py-0.5 text-xs text-primary",
        )}
      >
        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
        {statusLabel(status)}
      </span>
    );
  }

  if (status === "completed") {
    return (
      <span className="inline-flex items-center rounded-md bg-primary/15 px-1.5 py-0.5 text-xs text-primary">
        {statusLabel(status)}
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="inline-flex items-center rounded-md bg-destructive/15 px-1.5 py-0.5 text-xs text-destructive">
        {statusLabel(status)}
      </span>
    );
  }

  if (status === "skipped") {
    return (
      <span className="inline-flex items-center rounded-md bg-border px-1.5 py-0.5 text-xs text-muted-foreground">
        {statusLabel(status)}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md bg-amber-500/15 px-1.5 py-0.5 text-xs text-amber-600">
      {statusLabel(status)}
    </span>
  );
}

