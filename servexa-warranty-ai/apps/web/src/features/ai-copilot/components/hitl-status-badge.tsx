import type { HitlRequestStatus } from "@servexa-warranty-ai/ai-contracts";

import { cn } from "@servexa-warranty-ai/ui/lib/utils";

const STATUS_LABEL: Record<HitlRequestStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  edited: "Edited",
  expired: "Expired",
  executed: "Executed",
  failed: "Failed",
};

const STATUS_CLASS: Record<HitlRequestStatus, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  approved: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  rejected: "bg-muted text-muted-foreground",
  edited: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  expired: "bg-muted text-muted-foreground",
  executed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  failed: "bg-destructive/15 text-destructive",
};

type HitlStatusBadgeProps = {
  status: HitlRequestStatus;
  className?: string;
};

export function HitlStatusBadge({ status, className }: HitlStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        STATUS_CLASS[status],
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
