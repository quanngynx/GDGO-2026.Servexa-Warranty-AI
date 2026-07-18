import { useEffect, useState } from "react";
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import {
  type NavigateFn,
  useTableUrlState,
} from "@servexa-warranty-ai/ui/hooks/use-table-url-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@servexa-warranty-ai/ui/components/table";
import {
  DataTablePagination,
  DataTableToolbar,
} from "@servexa-warranty-ai/ui/components/data-table";
import { accessoryStatusOptions } from "../data/data";
import { type Accessory } from "../data/schema";
import { DataTableBulkActions } from "./data-table-bulk-actions";
import { accessoriesColumns as columns } from "./accessories-columns";
import { useTranslation } from "react-i18next";
import { MultiSelectFilter } from "@/components/multi-select-filter";

type DataTableProps = {
  data: Accessory[];
  isLoading?: boolean;
  totalPages?: number;
  search: Record<string, unknown>;
  navigate: NavigateFn;
  warehouseList: { id: string; name: string }[];
  ascCenterList: { id: string; centerName: string }[];
  selectedWarehouseIds: Set<string>;
  selectedAscCenterIds: Set<string>;
  onWarehouseChange: (newSelected: Set<string>) => void;
  onAscCenterChange: (newSelected: Set<string>) => void;
  onResetFilters?: () => void;
};

export function AccessoriesTable({
  data,
  isLoading = false,
  totalPages,
  search,
  navigate,
  warehouseList,
  ascCenterList,
  selectedWarehouseIds,
  selectedAscCenterIds,
  onWarehouseChange,
  onAscCenterChange,
  onResetFilters,
}: DataTableProps) {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const {
    columnFilters,
    onColumnFiltersChange,
    globalFilter,
    onGlobalFilterChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: true },
    columnFilters: [
      { columnId: "name", searchKey: "search", type: "string" },
      { columnId: "status", searchKey: "status", type: "array" },
    ],
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
    pageCount: totalPages,
    manualPagination: true,
    manualFiltering: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange,
    onGlobalFilterChange,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    ensurePageInRange(table.getPageCount());
  }, [table, ensurePageInRange]);

  const isCustomFiltered =
    selectedWarehouseIds.size > 0 || selectedAscCenterIds.size > 0;

  const handleResetFilters = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      if (selectedWarehouseIds.size > 0) {
        onWarehouseChange(new Set());
      }
      if (selectedAscCenterIds.size > 0) {
        onAscCenterChange(new Set());
      }
    }
  };

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        "flex flex-1 flex-col gap-4",
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder="Filter accessories..."
        filterColumnId="name"
        isFiltered={isCustomFiltered}
        onResetFilters={handleResetFilters}
        filters={[
          {
            columnId: "status",
            title: "Status",
            options: accessoryStatusOptions.map((o) => ({ ...o })),
          },
        ]}
      >
        {warehouseList.length > 0 && (
          <MultiSelectFilter
            title={t("Total Warehouses")}
            options={warehouseList.map((w) => ({ label: w.name, value: w.id }))}
            selectedValues={selectedWarehouseIds}
            onSelectionChange={onWarehouseChange}
          />
        )}
        {ascCenterList.length > 0 && (
          <MultiSelectFilter
            title={t("ASC Centers")}
            options={ascCenterList.map((a) => ({
              label: a.centerName,
              value: a.id,
            }))}
            selectedValues={selectedAscCenterIds}
            onSelectionChange={onAscCenterChange}
          />
        )}
      </DataTableToolbar>
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
                  {t("Loading...")}
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
                  {t("No results.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className="mt-auto" />
      <DataTableBulkActions table={table} />
    </div>
  );
}
