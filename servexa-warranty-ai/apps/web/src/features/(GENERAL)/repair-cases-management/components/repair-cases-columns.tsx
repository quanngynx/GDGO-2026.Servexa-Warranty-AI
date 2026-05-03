import { type ColumnDef } from "@tanstack/react-table";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import { Badge } from "@servexa-warranty-ai/ui/components/badge";
import { Checkbox } from "@servexa-warranty-ai/ui/components/checkbox";
import { DataTableColumnHeader } from "@servexa-warranty-ai/ui/components/data-table";
import { LongText } from "@/components/long-text";
import { DataTableRowActions } from "./data-table-row-actions";
import type { RepairCaseDto } from "@/libs/api/asc-center/repair-case/data-transfer-object";
import { CalendarIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

export const repairCasesColumns: ColumnDef<RepairCaseDto>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    meta: {
      className: cn("max-md:sticky start-0 z-10 rounded-tl-[inherit]"),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "caseNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Case #" />
    ),
    cell: ({ row }) => {
      const caseNumber = row.getValue<string>("caseNumber");
      const createdAt = new Date(row.original.createdAt);
      return (
        <div className="flex flex-col gap-1 w-max pl-1">
          <span className="font-medium">{caseNumber}</span>
          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <CalendarIcon className="h-3 w-3" />
            <span>{createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      );
    },
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]",
        "ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none"
      ),
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "customerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      const { customer } = row.original;
      return (
        <div className="flex flex-col gap-1 w-max">
          <span className="font-medium">{customer.fullName}</span>
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            {customer.phone1 && (
              <div className="flex items-center gap-1.5">
                <PhoneIcon className="h-3 w-3" />
                <span>{customer.phone1}</span>
              </div>
            )}
            {customer.email && (
              <div className="flex items-center gap-1.5">
                <MailIcon className="h-3 w-3" />
                <span>{customer.email}</span>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center gap-1.5">
                <MapPinIcon className="h-3 w-3 min-w-3" />
                <LongText className="max-w-48">{customer.address}</LongText>
              </div>
            )}
          </div>
        </div>
      );
    },
    meta: { className: "w-56" },
  },
  {
    id: "modelName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Model" />
    ),
    cell: ({ row }) => {
      const { model } = row.original;
      return <LongText className="max-w-48">{model.name}</LongText>;
    },
    meta: { className: "w-48" },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="capitalize">
          {row.getValue("status")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="capitalize">
          {row.getValue("priority")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "receivedDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Received Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("receivedDate"));
      return <div className="w-[100px]">{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: DataTableRowActions,
  },
];
