import type { WorkflowProgress } from "@servexa-warranty-ai/ai-contracts";
import { Check, Circle, ListChecks, Loader2, X } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@servexa-warranty-ai/ui/components/collapsible";

import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import { useTranslation } from "react-i18next";

type WorkflowProgressCardProps = {
  progress: WorkflowProgress;
  className?: string;
};

type StepStatus = WorkflowProgress["steps"][number]["status"];

function connectorTone(current: StepStatus, next: StepStatus): string {
  if (current === "failed" || next === "failed") return "bg-destructive/40";
  if (current === "done" && next !== "pending") return "bg-primary/50";
  if (current === "done") return "bg-border";
  return "bg-border";
}

function StepIndicator({ status }: { status: StepStatus }) {
    const { t } = useTranslation();
  if (status === "done") {
    return (
      <span
        className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
        aria-hidden
      >
        <Check className="size-3" />
      </span>
    );
  }

  if (status === "active") {
    return (
      <span
        className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary"
        aria-hidden
      >
        <Loader2 className="size-3 animate-spin" />
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span
        className="flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
        aria-hidden
      >
        <X className="size-3" />
      </span>
    );
  }

  return (
    <span
      className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground"
      aria-hidden
    >
      <Circle className="size-1.5 fill-current" />
    </span>
  );
}

function WorkflowStepper({ progress }: { progress: WorkflowProgress }) {
    const { t } = useTranslation();
  return (
    <ol
      className="flex w-full min-w-0 items-start overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Workflow progress"
    >
      {progress.steps.map((step, index) => {
        const isFirst = index === 0;
        const isLast = index === progress.steps.length - 1;
        const prev = progress.steps[index - 1];
        const next = progress.steps[index + 1];

        const labelClass =
          step.status === "active"
            ? "font-medium text-primary"
            : step.status === "done"
              ? "text-foreground"
              : step.status === "failed"
                ? "font-medium text-destructive"
                : "text-muted-foreground";

        const hint =
          step.status === "active"
            ? "In progress"
            : step.status === "failed"
              ? "Needs attention"
              : null;

        return (
          <li
            key={step.key}
            className="flex min-w-13 flex-1 flex-col items-center"
            aria-current={step.status === "active" ? "step" : undefined}
          >
            <div className="flex h-5 w-full items-center">
              <div
                className={cn(
                  "h-0.5 min-w-2 flex-1 rounded-full",

                  isFirst
                    ? "bg-transparent"
                    : connectorTone(prev!.status, step.status),
                )}
                aria-hidden
              />

              <StepIndicator status={step.status} />

              <div
                className={cn(
                  "h-0.5 min-w-2 flex-1 rounded-full",

                  isLast
                    ? "bg-transparent"
                    : connectorTone(step.status, next!.status),
                )}
                aria-hidden
              />
            </div>

            <p
              className={cn(
                "mt-1.5 w-full px-0.5 text-center text-[9px] leading-tight",

                labelClass,
              )}
              title={step.label}
            >
              {step.label}
            </p>

            {hint ? (
              <p
                className={cn(
                  "mt-0.5 w-full px-0.5 text-center text-[8px] leading-tight",

                  step.status === "failed"
                    ? "text-destructive/80"
                    : "text-muted-foreground",
                )}
              >
                {hint}
              </p>
            ) : (
              <span className="mt-0.5 block h-2.5" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function WorkflowProgressCard({
  progress,
  className,
}: WorkflowProgressCardProps) {
    const { t } = useTranslation();
  return (
    <Collapsible
      defaultOpen
      className={cn("border-t border-border px-2 py-2", className)}
    >
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium hover:bg-muted">
        <ListChecks
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
        {t("Workflow progress")}</CollapsibleTrigger>

      <CollapsibleContent className="px-2 pb-2 pt-1">
        <WorkflowStepper progress={progress} />
      </CollapsibleContent>
    </Collapsible>
  );
}
