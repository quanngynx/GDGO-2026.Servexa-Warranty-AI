"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { showSubmittedData } from "@/components/show-submitted-data";
import { Alert, AlertDescription, AlertTitle } from "@servexa-warranty-ai/ui/components/alert";
import { Input } from "@servexa-warranty-ai/ui/components/input";
import { Label } from "@servexa-warranty-ai/ui/components/label";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { type Customer } from "../data/schema";

type CustomerDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Customer;
};

export function CustomersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: CustomerDeleteDialogProps) {
  const [value, setValue] = useState("");

  const handleDelete = () => {
    if (value.trim() !== currentRow.email) return;

    onOpenChange(false);
    showSubmittedData(currentRow, "The following customer has been deleted:");
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.email}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="me-1 inline-block stroke-destructive"
            size={18}
          />{" "}
          Delete Customer
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">{currentRow.email}</span>?
            <br />
            This action will permanently remove the customer with the email of{" "}
            <span className="font-bold">{currentRow.email}</span>
            from the system. This cannot be undone.
          </p>

          <Label className="my-2">
            Email:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter email to confirm deletion."
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
}
