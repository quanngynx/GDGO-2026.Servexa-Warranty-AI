import type { HitlRequest } from "@servexa-warranty-ai/ai-contracts";
import { memo, useState } from "react";

import { Button } from "@servexa-warranty-ai/ui/components/button";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";

import { HitlEditPayloadDialog } from "./hitl-edit-payload-dialog";
import { HitlRejectDialog } from "./hitl-reject-dialog";
import { HitlStatusBadge } from "./hitl-status-badge";
import { useTranslation } from "react-i18next";

type HitlApprovalCardProps = {
  request: HitlRequest;
  isSubmitting?: boolean;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, reason?: string) => void;
  onEdit: (
    requestId: string,
    editedPayload: Record<string, unknown>,
    reason?: string,
  ) => void;
  className?: string;
};

function HitlApprovalCardInner({
  request,
  isSubmitting,
  onApprove,
  onReject,
  onEdit,
  className,
}: HitlApprovalCardProps) {
    const { t } = useTranslation();
  const [editOpen, setEditOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const caseLabel =
    (request.payload.caseNumber as string | undefined) ??
    request.repairCaseId ??
    "case";
  const technicianId = String(request.payload.technicianId ?? "").trim();
  const needsTechnician =
    request.kind === "technician_assignment" && technicianId.length === 0;

  return (
    <>
      <article
        className={cn(
          "rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 text-sm",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
            {t("AI needs approval")}</p>
          <HitlStatusBadge status={request.status} />
        </div>
        <h4 className="mt-1 font-semibold text-foreground">{request.title}</h4>
        <p className="mt-1 text-xs text-muted-foreground">{request.description}</p>
        <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <div>
            <dt className="inline font-medium">{t("Target:")}</dt>
            <dd className="inline">{caseLabel}</dd>
          </div>
          {request.riskLevel ? (
            <div>
              <dt className="inline font-medium">{t("Risk:")}</dt>
              <dd className="inline capitalize">{request.riskLevel}</dd>
            </div>
          ) : null}
          {request.confidence != null ? (
            <div>
              <dt className="inline font-medium">{t("Confidence:")}</dt>
              <dd className="inline">{Math.round(request.confidence * 100)}%</dd>
            </div>
          ) : null}
        </dl>
        {request.evidenceSourceIds && request.evidenceSourceIds.length > 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{t("Evidence:")}</span>
            {request.evidenceSourceIds.join(", ")}
          </p>
        ) : null}
        {needsTechnician ? (
          <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
            {t("Select a technician via Edit before approving.")}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            disabled={isSubmitting}
            onClick={() => {
              if (needsTechnician) {
                setEditOpen(true);
                return;
              }
              onApprove(request.id);
            }}
          >
            {needsTechnician ? "Select technician" : "Approve"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => setRejectOpen(true)}
          >
            {t("Reject")}</Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={isSubmitting}
            onClick={() => setEditOpen(true)}
          >
            {t("Edit")}</Button>
        </div>
      </article>
      <HitlEditPayloadDialog
        request={request}
        open={editOpen}
        onOpenChange={setEditOpen}
        isSubmitting={isSubmitting}
        onSubmit={(editedPayload, reason) => {
          onEdit(request.id, editedPayload, reason);
          setEditOpen(false);
        }}
      />
      <HitlRejectDialog
        request={request}
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        isSubmitting={isSubmitting}
        onSubmit={(reason) => {
          onReject(request.id, reason);
          setRejectOpen(false);
        }}
      />
    </>
  );
}

export const HitlApprovalCard = memo(HitlApprovalCardInner);
