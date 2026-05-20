import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@servexa-warranty-ai/ui/components/table'
import { useTableUrlState, type NavigateFn } from '@servexa-warranty-ai/ui/hooks/use-table-url-state'
import { useEffect, useState } from 'react'
import { flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type SortingState, type VisibilityState } from '@tanstack/react-table'
import type { RepairCaseDto } from '@/libs/api/asc-center/repair-case/data-transfer-object'
import { repairCasesColumns as columns } from './repair-cases-columns'
import {
  DataTablePagination,
  DataTableToolbar,
} from "@servexa-warranty-ai/ui/components/data-table";
import { DataTableBulkActions } from "./data-table-bulk-actions";
import { cn } from '@servexa-warranty-ai/ui/lib/utils'
import { useOperationalContextPatch } from '@/features/ai-copilot/context/operational-context-provider'

type RepairCasesTableProps = {
  data: RepairCaseDto[]
  isLoading?: boolean
  totalPages?: number
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function RepairCasesTable({
  data,
  isLoading = false,
  totalPages,
  search,
  navigate
}: RepairCasesTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const { setOperationalContext, clearOperationalContext } = useOperationalContextPatch();

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      { columnId: "username", searchKey: "username", type: "string" },
      { columnId: "status", searchKey: "status", type: "array" },
      { columnId: "priority", searchKey: "priority", type: "array" },
      { columnId: "ascCenterId", searchKey: "ascCenterId", type: "array" },
    ],
  });

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    manualPagination: totalPages !== undefined,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection: true,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    ensurePageInRange(table.getPageCount());
  }, [table, ensurePageInRange]);

  useEffect(() => {
    const selected = table.getFilteredSelectedRowModel().rows;
    if (selected.length === 0) {
      clearOperationalContext();
      return;
    }
    const row = selected[0]!.original;
    setOperationalContext({
      repairCaseId: row.id,
      caseNumber: row.caseNumber,
      customerId: row.customerId,
      technicianId: row.assignedTechnicianId ?? null,
      selectedTechnicianId: row.assignedTechnicianId ?? null,
      productModel: row.model?.name ?? null,
      warrantyStatus: row.warrantyServiceType ?? row.warrantyForm ?? null,
      repairCaseSnapshot: {
        caseNumber: row.caseNumber,
        status: row.status,
        priority: row.priority,
        customerName: row.customer.fullName,
        customerPhone: row.customer.phone1,
        productModel: row.model?.name ?? null,
        modelCode: row.model?.modelCode ?? null,
        serialNumber: row.serialNumber,
        receivedDate: String(row.receivedDate),
        promisedDeliveryDate: String(row.promisedDeliveryDate),
        warrantyForm: row.warrantyForm,
        warrantyServiceType: row.warrantyServiceType,
        totalCost: row.totalCost,
        errorPhenomena:
          row.errorPhenomena
            ?.map((item) => item.errorPhenomenon.name)
            .filter(Boolean)
            .join(", ") || null,
      },
    });
  }, [rowSelection, data, table, setOperationalContext, clearOperationalContext]);

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        "flex flex-1 flex-col gap-4",
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder="Filter users..."
        searchKey="username"
        filters={[
          {
            columnId: "status",
            title: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "Invited", value: "invited" },
              { label: "Suspended", value: "suspended" },
            ],
          },
          {
            columnId: "priority",
            title: "Priority",
            options: [
              { label: "High", value: "high" },
              { label: "Medium", value: "medium" },
              { label: "Low", value: "low" },
            ],
          },
          {
            columnId: "ascCenterId",
            title: "ASC center",
            options: [
              { label: "ASC 003", value: "23aa11b9-00b4-49eb-8a33-b147dbf33bb7" },
            ],
          },
        ]}
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.thClassName,
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group/row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName,
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className="mt-auto" />
      <DataTableBulkActions table={table} />
    </div>
  )
}
