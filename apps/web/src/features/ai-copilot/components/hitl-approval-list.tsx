import type { HitlRequest } from "@servexa-warranty-ai/ai-contracts";

import { cn } from "@servexa-warranty-ai/ui/lib/utils";

import { HitlApprovalCard } from "./hitl-approval-card";
import { HitlDecisionResult } from "./hitl-decision-result";
import { useTranslation } from "react-i18next";

type HitlApprovalListProps = {
  pending: HitlRequest[];
  decided: HitlRequest[];
  isSubmitting?: boolean;
  error?: string | null;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, reason?: string) => void;
  onEdit: (
    requestId: string,
    editedPayload: Record<string, unknown>,
    reason?: string,
  ) => void;
  className?: string;
};

export function HitlApprovalList({
  pending,
  decided,
  isSubmitting,
  error,
  onApprove,
  onReject,
  onEdit,
  className,
}: HitlApprovalListProps) {
    const { t } = useTranslation();
  const recentDecided = decided.slice(0, 3);

  return (
    <section
      className={cn("border-t border-border px-2 py-2", className)}
      aria-label="Pending AI approvals"
    >
      <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
        {t("Pending approvals")}{pending.length > 0 ? ` (${pending.length})` : ""}
      </p>
      {error ? (
        <p className="mb-2 px-2 text-xs text-destructive">{error}</p>
      ) : null}
      {pending.length === 0 ? (
        <p className="px-2 pb-1 text-xs text-muted-foreground">
          {t("Workflow actions that need your approval will appear here.")}</p>
      ) : (
        <ul className="space-y-2 px-1 pb-1">
          {pending.map((request) => (
            <li key={request.id}>
              <HitlApprovalCard
                request={request}
                isSubmitting={isSubmitting}
                onApprove={onApprove}
                onReject={onReject}
                onEdit={onEdit}
              />
            </li>
          ))}
        </ul>
      )}
      {recentDecided.length > 0 ? (
        <ul className="mt-2 space-y-1 px-2">
          {recentDecided.map((r) => (
            <li key={r.id}>
              <HitlDecisionResult request={r} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
