import { DataTableBulkActions as BulkActionsToolbar } from "@servexa-warranty-ai/ui/components/data-table";
import { Button } from "@servexa-warranty-ai/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@servexa-warranty-ai/ui/components/tooltip";
import { type Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { CustomersMultiDeleteDialog } from "./customer-multi-delete-dialog";
import { useTranslation } from "react-i18next";

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>;
};

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
    const { t } = useTranslation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <BulkActionsToolbar table={table} entityName="customer">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              className="size-8"
              aria-label="Delete selected customers"
              title={t("Delete selected customers")}
            >
              <Trash2 />
              <span className="sr-only">{t("Delete selected customers")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("Delete selected customers")}</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <CustomersMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  );
}
