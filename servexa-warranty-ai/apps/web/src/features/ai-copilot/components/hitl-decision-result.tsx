import type { HitlRequest } from "@servexa-warranty-ai/ai-contracts";

import { cn } from "@servexa-warranty-ai/ui/lib/utils";

type HitlDecisionResultProps = {
  request: HitlRequest;
  className?: string;
};

export function HitlDecisionResult({ request, className }: HitlDecisionResultProps) {
  if (request.status === "pending" || request.status === "edited") return null;

  const tone =
    request.status === "executed"
      ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300"
      : request.status === "failed"
        ? "border-destructive/40 bg-destructive/5 text-destructive"
        : "border-border bg-muted/30 text-muted-foreground";

  const label =
    request.status === "executed"
      ? "Action executed"
      : request.status === "failed"
        ? "Action failed"
        : request.status === "rejected"
          ? "Request rejected"
          : `Status: ${request.status}`;

  return (
    <p className={cn("rounded-md border px-2 py-1.5 text-xs", tone, className)}>
      {label}
      {request.status === "failed" && request.payload.executionResult == null
        ? ""
        : null}
    </p>
  );
}
