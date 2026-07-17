import type { CopilotRailMetadata } from "@servexa-warranty-ai/ai-contracts";
import { Loader2 } from "lucide-react";

import { cn } from "@servexa-warranty-ai/ui/lib/utils";

import type { OperationalPageContext } from "../hooks/use-operational-context";
import { useTranslation } from "react-i18next";

type CopilotRailHeaderProps = {
  operational: OperationalPageContext;
  /** CopilotKit / AG-UI running flag when available. */
  isRunning?: boolean;
  railMeta?: CopilotRailMetadata;
  runError?: string | null;
  pendingApprovalCount?: number;
  /** Hide duplicate page title when the shell already shows it (full-page layout). */
  showTitle?: boolean;
  className?: string;
};

export function CopilotRailHeader({
  operational,
  isRunning,
  railMeta,
  runError,
  pendingApprovalCount = 0,
  showTitle = true,
  className,
}: CopilotRailHeaderProps) {
    const { t } = useTranslation();
  const scopeParts = [operational.currentRoute];
  if (operational.caseNumber || operational.repairCaseId) {
    scopeParts.push(
      operational.caseNumber
        ? `case ${operational.caseNumber}`
        : `case #${operational.repairCaseId}`,
    );
  }
  if (operational.currentUserRole) {
    scopeParts.push(`role: ${operational.currentUserRole}`);
  }
  const backend = railMeta?.backend;

  return (
    <div className={cn("space-y-1 border-b border-border px-3 py-2", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {showTitle ? (
            <p className="truncate text-sm font-semibold tracking-tight">{t("Operations Intelligence")}</p>
          ) : (
            <p className="truncate text-sm font-semibold tracking-tight">{t("Context panel")}</p>
          )}
          <p className="truncate text-xs text-muted-foreground">{scopeParts.join(" · ")}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {pendingApprovalCount > 0 ? (
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-amber-200">
              {pendingApprovalCount} {t("pending")}</span>
          ) : null}
          {backend ? (
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
              {backend === "grpc" ? "Python" : "Gemini"}
            </span>
          ) : null}
          {isRunning ? (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground" aria-live="polite">
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              {t("Thinking")}</span>
          ) : (
            <span className="text-[11px] text-muted-foreground">{t("Ready")}</span>
          )}
        </div>
      </div>
      {typeof railMeta?.confidence === "number" ? (
        <p className="text-[11px] text-muted-foreground">
          {t("Model confidence:")}{(railMeta.confidence * 100).toFixed(0)}%
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
