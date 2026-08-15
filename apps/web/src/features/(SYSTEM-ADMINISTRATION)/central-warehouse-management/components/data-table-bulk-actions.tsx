import { useState } from "react";
import { type Table } from "@tanstack/react-table";
import { Trash2, UserX, UserCheck, Mail } from "lucide-react";
import { toast } from "sonner";
import { sleep } from "@servexa-warranty-ai/ui/lib/utils";
import { Button } from "@servexa-warranty-ai/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@servexa-warranty-ai/ui/components/tooltip";
import { DataTableBulkActions as BulkActionsToolbar } from "@servexa-warranty-ai/ui/components/data-table";
import { type TotalWarehouse } from '../data/schema'
import { UsersMultiDeleteDialog } from "./central-warehouse-multi-delete-dialog";
import { useTranslation } from "react-i18next";

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>;
};

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
    const { t } = useTranslation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleBulkStatusChange = (status: "active" | "inactive") => {
    const selectedUsers = selectedRows.map((row) => row.original as TotalWarehouse);
    toast.promise(sleep(2000), {
      loading: `${status === "active" ? "Activating" : "Deactivating"} users...`,
      success: () => {
        table.resetRowSelection();
        return `${status === "active" ? "Activated" : "Deactivated"} ${selectedUsers.length} user${selectedUsers.length > 1 ? "s" : ""}`;
      },
      error: `Error ${status === "active" ? "activating" : "deactivating"} users`,
    });
    table.resetRowSelection();
  };

  const handleBulkInvite = () => {
    const selectedUsers = selectedRows.map((row) => row.original as TotalWarehouse);
    toast.promise(sleep(2000), {
      loading: "Inviting users...",
      success: () => {
        table.resetRowSelection();
        return `Invited ${selectedUsers.length} user${selectedUsers.length > 1 ? "s" : ""}`;
      },
      error: "Error inviting users",
    });
    table.resetRowSelection();
  };

  return (
    <>
      <BulkActionsToolbar table={table} entityName="user">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleBulkInvite}
              className="size-8"
              aria-label="Invite selected users"
              title={t("Invite selected users")}
            >
              <Mail />
              <span className="sr-only">{t("Invite selected users")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("Invite selected users")}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleBulkStatusChange("active")}
              className="size-8"
              aria-label="Activate selected users"
              title={t("Activate selected users")}
            >
              <UserCheck />
              <span className="sr-only">{t("Activate selected users")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("Activate selected users")}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleBulkStatusChange("inactive")}
              className="size-8"
              aria-label="Deactivate selected users"
              title={t("Deactivate selected users")}
            >
              <UserX />
              <span className="sr-only">{t("Deactivate selected users")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("Deactivate selected users")}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              className="size-8"
              aria-label="Delete selected users"
              title={t("Delete selected users")}
            >
              <Trash2 />
              <span className="sr-only">{t("Delete selected users")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("Delete selected users")}</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <UsersMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  );
}
