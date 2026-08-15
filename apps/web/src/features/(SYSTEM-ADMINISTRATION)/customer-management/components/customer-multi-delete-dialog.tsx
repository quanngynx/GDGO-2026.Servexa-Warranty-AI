

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Alert, AlertDescription, AlertTitle } from "@servexa-warranty-ai/ui/components/alert";
import { Input } from "@servexa-warranty-ai/ui/components/input";
import { Label } from "@servexa-warranty-ai/ui/components/label";
import { sleep } from "@servexa-warranty-ai/ui/lib/utils";
import { type Table } from "@tanstack/react-table";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type CustomersMultiDeleteDialogProps<TData> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: Table<TData>;
};

const CONFIRM_WORD = "DELETE";

export function CustomersMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: CustomersMultiDeleteDialogProps<TData>) {
    const { t } = useTranslation();
  const [value, setValue] = useState("");

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`);
      return;
    }

    onOpenChange(false);

    toast.promise(sleep(2000), {
      loading: "Deleting customers...",
      success: () => {
        setValue("");
        table.resetRowSelection();
        return `Deleted ${selectedRows.length} ${
          selectedRows.length > 1 ? "customers" : "customer"
        }`;
      },
      error: "Error",
    });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="me-1 inline-block stroke-destructive"
            size={18}
          />{" "}
          {t("Delete")}{selectedRows.length}{" "}
          {selectedRows.length > 1 ? "customers" : "customer"}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            {t("Are you sure you want to delete the selected customers?")}<br />
            {t("This action cannot be undone.")}</p>

          <Label className="my-4 flex flex-col items-start gap-1.5">
            <span className="">{t("Confirm by typing \"")}{CONFIRM_WORD}":</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
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
