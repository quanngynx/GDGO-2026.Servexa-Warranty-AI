import type { HitlRequest } from "@servexa-warranty-ai/ai-contracts";
import { useState } from "react";

import { Button } from "@servexa-warranty-ai/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@servexa-warranty-ai/ui/components/dialog";
import { Label } from "@servexa-warranty-ai/ui/components/label";
import { Textarea } from "@servexa-warranty-ai/ui/components/textarea";
import { useTranslation } from "react-i18next";

type HitlRejectDialogProps = {
  request: HitlRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string) => void;
  isSubmitting?: boolean;
};

export function HitlRejectDialog({
  request,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: HitlRejectDialogProps) {
    const { t } = useTranslation();
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    const trimmed = reason.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setReason("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setReason("");
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("Reject approval")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{request.title}</p>
        <div className="space-y-2 py-2">
          <Label htmlFor="hitl-reject-reason">{t("Reason (required)")}</Label>
          <Textarea
            id="hitl-reject-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("Explain why this action should not proceed…")}
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("Cancel")}</Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isSubmitting || !reason.trim()}
            onClick={handleSubmit}
          >
            {t("Reject")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
