

import { ConfirmDialog } from "@/components/confirm-dialog";
import { useDeleteCustomerMutation } from '../hooks/use-delete-customer-mutation'
import { Alert, AlertDescription, AlertTitle } from "@servexa-warranty-ai/ui/components/alert";
import { Input } from "@servexa-warranty-ai/ui/components/input";
import { Label } from "@servexa-warranty-ai/ui/components/label";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { type Customer } from "../data/schema";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
  const [value, setValue] = useState("");
  const deleteMutation = useDeleteCustomerMutation();
  const confirmValue = currentRow.email ?? currentRow.fullName;

  const handleDelete = () => {
    if (value.trim() !== confirmValue) return;

    deleteMutation.mutate(currentRow.id, {
      onSuccess: () => {
        onOpenChange(false);
        setValue("");
      },
    });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== confirmValue || deleteMutation.isPending}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="me-1 inline-block stroke-destructive"
            size={18}
          />{" "}
          {t("Delete Customer")}</span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            {t("Are you sure you want to delete")}{" "}
            <span className="font-bold">{confirmValue}</span>?
            <br />
            {t("This action will permanently remove the customer")}{" "}
            <span className="font-bold">{confirmValue}</span>
            {t("from the system. This cannot be undone.")}</p>

          <Label className="my-2">
            {t("Confirm (")}{confirmValue}):
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("Type the value above to confirm deletion.")}
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>{t("Warning!")}</AlertTitle>
            <AlertDescription>
              {t("Please be careful, this operation can not be rolled back.")}</AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
}
