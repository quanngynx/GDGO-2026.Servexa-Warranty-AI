import type { CopilotRailMetadata } from "@servexa-warranty-ai/ai-contracts";
import { Loader2 } from "lucide-react";

import { cn } from "@servexa-warranty-ai/ui/lib/utils";

import type { OperationalPageContext } from "../hooks/use-operational-context";

type CopilotRailHeaderProps = {
  operational: OperationalPageContext;
  /** CopilotKit / AG-UI running flag when available. */
  isRunning?: boolean;
  railMeta?: CopilotRailMetadata;
  runError?: string | null;
  className?: string;
};

export function CopilotRailHeader({
  operational,
  isRunning,
  railMeta,
  runError,
  className,
}: CopilotRailHeaderProps) {
  const scopeParts = [operational.currentRoute];
  if (operational.currentUserRole) {
    scopeParts.push(`role: ${operational.currentUserRole}`);
  }
  const backend = railMeta?.backend;

  return (
    <div className={cn("space-y-1 border-b border-border px-3 py-2", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight">Operations Intelligence</p>
          <p className="truncate text-xs text-muted-foreground">{scopeParts.join(" · ")}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {backend ? (
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
              {backend === "grpc" ? "Python" : "Gemini"}
            </span>
          ) : null}
          {isRunning ? (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground" aria-live="polite">
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              Thinking
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground">Ready</span>
          )}
        </div>
      </div>
      {typeof railMeta?.confidence === "number" ? (
        <p className="text-[11px] text-muted-foreground">
          Model confidence: {(railMeta.confidence * 100).toFixed(0)}%
        </p>
      ) : null}
      {runError ? (
        <p className="rounded-md bg-destructive/10 px-2 py-1 text-xs text-destructive" role="alert">
          {runError}
        </p>
      ) : null}
    </div>
  );
}
