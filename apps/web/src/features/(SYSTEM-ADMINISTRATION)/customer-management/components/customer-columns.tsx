import { DataTableColumnHeader, DragHandle } from "@servexa-warranty-ai/ui/components/data-table";
import { LongText } from "@/components/long-text";
import { Checkbox } from "@servexa-warranty-ai/ui/components/checkbox";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import { type ColumnDef } from "@tanstack/react-table";
import { customerGroupOptions } from "../data/data";
import { type Customer } from "../data/schema";
import { DataTableRowActions } from "./data-table-row-actions";
import { t } from "i18next";

export const customersColumns: ColumnDef<Customer>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: cn("sticky left-0 z-20 bg-background"),
      thClassName: cn("sticky left-0 z-20 bg-background"),
    },
  },
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
        className="mr-2"
      />
    ),
    meta: {
      className: cn("sticky left-10 z-20 bg-background"),
      thClassName: cn("sticky left-10 z-20 bg-background"),
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
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("Full Name")} />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-36 ps-3">{row.getValue("fullName")}</LongText>
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]",
        "ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none"
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("Email")} />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-36 ps-3">{row.getValue("email")}</LongText>
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]",
        "ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none"
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: "phone1",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("Phone Number 1")} />
    ),
    cell: ({ row }) => (
      <div className="w-fit ps-2 text-nowrap">{row.getValue("phone1")}</div>
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]",
        "ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none"
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: "phone2",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("Phone Number 2")} />
    ),
    cell: ({ row }) => (
      <div className="w-fit ps-2 text-nowrap">{row.getValue("phone2")}</div>
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]",
        "ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none"
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: "provinceId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("Province")} />
    ),
    enableSorting: false,
    cell: ({ row }) => <div>{row.getValue("provinceId") ?? "—"}</div>,
  },
  {
    accessorKey: "wardId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("Ward")} />
    ),
    cell: ({ row }) => <div>{row.getValue("wardId") ?? "—"}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("Address")} />
    ),
    cell: ({ row }) => <div>{row.getValue("address")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "taxCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("Tax Code")} />
    ),
    cell: ({ row }) => <div>{row.getValue("taxCode")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "bankName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("Bank Name")} />
    ),
    cell: ({ row }) => <div>{row.getValue("bankName")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "accountNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("Account Number")} />
    ),
    cell: ({ row }) => <div>{row.getValue("accountNumber")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "contactPerson",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("Contact Person")} />
    ),
    cell: ({ row }) => <div>{row.getValue("contactPerson")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "ascCenterId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("ASC Center")} />
    ),
    cell: ({ row }) => <div>{row.getValue("ascCenterId") ?? "—"}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "customerGroup",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("Customer Group")} />
    ),
    cell: ({ row }) => {
      const { customerGroup } = row.original;
      const customerGroupType = customerGroupOptions.find(
        ({ value }) => value === customerGroup
      );

      if (!customerGroupType) {
        return null;
      }

      return (
        <div className="flex items-center gap-x-2">
          {customerGroupType.icon && (
            <customerGroupType.icon
              size={16}
              className="text-muted-foreground"
            />
          )}
          <span className="text-sm capitalize">
            {row.getValue("customerGroup")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "createdAt",
    accessorFn: (row) => new Date(row.createdAt).toLocaleDateString(),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("Created At")} />
    ),
    cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "updatedAt",
    accessorFn: (row) => new Date(row.updatedAt).toLocaleDateString(),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("Updated At")} />
    ),
    cell: ({ row }) => <div>{row.getValue("updatedAt")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("Actions")} />
    ),
    cell: DataTableRowActions,
    meta: {
      className: cn(
        "sticky right-0 z-20 bg-background border-l border-l-border"
      ),
      thClassName: cn(
        "sticky right-0 z-20 bg-background border-l border-l-border"
      ),
    },
    enableSorting: false,
    enableHiding: false,
  },
];
