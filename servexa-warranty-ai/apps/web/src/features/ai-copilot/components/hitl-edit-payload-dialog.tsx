import type { HitlRequest } from "@servexa-warranty-ai/ai-contracts";
import { useEffect, useState } from "react";

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

import { HitlTechnicianSelectField } from "./hitl-technician-select-field";

type HitlEditPayloadDialogProps = {
  request: HitlRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (editedPayload: Record<string, unknown>, reason?: string) => void;
  isSubmitting?: boolean;
};

export function HitlEditPayloadDialog({
  request,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: HitlEditPayloadDialogProps) {
  const [reason, setReason] = useState("");
  const [body, setBody] = useState(
    String((request.payload.body) ?? request.description),
  );
  const [techId, setTechId] = useState(
    String((request.payload.technicianId) ?? ""),
  );
  const [techName, setTechName] = useState(
    String((request.payload.technicianName) ?? ""),
  );

  useEffect(() => {
    if (!open) return;
    setReason("");
    setBody(String((request.payload.body) ?? request.description));
    setTechId(String((request.payload.technicianId) ?? ""));
    setTechName(String((request.payload.technicianName) ?? ""));
  }, [open, request]);

  const handleSubmit = () => {
    if (request.kind === "technician_assignment" && !techId.trim()) {
      return;
    }
    const edited: Record<string, unknown> = { ...request.payload };
    if (request.kind === "customer_response_draft") {
      edited.body = body;
    }
    if (request.kind === "technician_assignment") {
      edited.technicianId = techId.trim();
      if (techName.trim()) {
        edited.technicianName = techName.trim();
      }
    }
    if (request.kind === "repair_escalation" && reason.trim()) {
      edited.reason = reason.trim();
    }
    onSubmit(edited, reason.trim() || undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit approval</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          {request.kind === "customer_response_draft" ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="hitl-draft-body">Draft message</Label>
              <Textarea
                id="hitl-draft-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
              />
            </div>
          ) : null}
          {request.kind === "technician_assignment" ? (
            <HitlTechnicianSelectField
              value={techId}
              disabled={isSubmitting}
              onValueChange={(id, name) => {
                setTechId(id);
                if (name) setTechName(name);
              }}
            />
          ) : null}
          <div className="flex flex-col gap-2">
            <Label htmlFor="hitl-reason">Reason / notes</Label>
            <Textarea
              id="hitl-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Optional context for audit"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (request.kind === "technician_assignment" && !techId.trim())
            }
          >
            Save edits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
