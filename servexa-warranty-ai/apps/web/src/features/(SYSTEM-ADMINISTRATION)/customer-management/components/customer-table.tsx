import {
  DataTablePagination,
  DataTableToolbar,
  DraggableRow,
} from "@servexa-warranty-ai/ui/components/data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@servexa-warranty-ai/ui/components/table";
import { type NavigateFn, useTableUrlState } from "@servexa-warranty-ai/ui/hooks/use-table-url-state";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import {
  type DragEndEvent,
  type UniqueIdentifier,
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
import { useEffect, useId, useMemo, useState } from "react";
import { customerGroupOptions } from "../data/data";
import { type Customer } from "../data/schema";
import { customersColumns as columns } from "./customer-columns";
import { DataTableBulkActions } from "./data-table-bulk-actions";

type DataTableProps = {
  data: Customer[];
  isLoading?: boolean;
  totalPages?: number;
  search: Record<string, unknown>;
  navigate: NavigateFn;
};

export function CustomersTable({
  data: initialData,
  isLoading = false,
  totalPages,
  search,
  navigate,
}: DataTableProps) {
  const [data, setData] = useState(() => initialData);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pinnedRows, setPinnedRows] = useState<Set<string>>(new Set());

  // Local state management for table (uncomment to use local-only state, not synced with URL)
  // const [columnFilters, onColumnFiltersChange] = useState<ColumnFiltersState>([])
  // const [pagination, onPaginationChange] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  // Synced with URL states (keys/defaults mirror users route search schema)
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
      // username per-column text filter
      { columnId: "customerGroup", searchKey: "customerGroup", type: "string" },
      { columnId: "fullName", searchKey: "search", type: "string" },
      { columnId: "email", searchKey: "email", type: "string" },
      { columnId: "phone1", searchKey: "phone1", type: "string" },
    ],
  });

  const sortableId = useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  useEffect(() => {
    setData(initialData)
  }, [initialData])

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
    getRowId: (row) => row.id.toString(),
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

  const selectedRowIds = useMemo(
    () =>
      Object.keys(rowSelection).filter(
        (key) => rowSelection[key as keyof typeof rowSelection]
      ),
    [rowSelection]
  );

  const togglePinSelectedRows = () => {
    setPinnedRows((prev) => {
      const newPinned = new Set(prev);
      selectedRowIds.forEach((id) => {
        if (newPinned.has(id)) {
          newPinned.delete(id);
        } else {
          newPinned.add(id);
        }
      });
      return newPinned;
    });
  };

  const unpinAllRows = () => {
    setPinnedRows(new Set());
  };

  const { pinnedTableRows, unpinnedTableRows } = useMemo(() => {
    const rows = table.getRowModel().rows;
    const pinned: typeof rows = [];
    const unpinned: typeof rows = [];

    rows.forEach((row) => {
      if (pinnedRows.has(row.id)) {
        pinned.push(row);
      } else {
        unpinned.push(row);
      }
    });

    return { pinnedTableRows: pinned, unpinnedTableRows: unpinned };
  }, [table, pinnedRows]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16', // Add margin bottom to the table on mobile when the toolbar is visible
        "flex flex-1 flex-col gap-4"
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder="Filter customers..."
        filterColumnId="fullName"
        filters={[
          {
            columnId: "customerGroup",
            title: "Customer Group",
            options: customerGroupOptions.map((customerGroup) => ({
              ...customerGroup,
            })),
          },
        ]}
      />
      {selectedRowIds.length > 0 && (
        <div className="flex items-center gap-2 px-4">
          <button
            type="button"
            onClick={togglePinSelectedRows}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {selectedRowIds.some((id) => pinnedRows.has(id))
              ? "Unpin Selected"
              : "Pin Selected"}
          </button>
          {pinnedRows.size > 0 && (
            <button
              type="button"
              onClick={unpinAllRows}
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Unpin All ({pinnedRows.size})
            </button>
          )}
        </div>
      )}
      <div className="relative overflow-x-auto rounded-md border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="group/row">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        "bg-background",
                        header.column.columnDef.meta?.className,
                        header.column.columnDef.meta?.thClassName
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {/* Pinned Rows */}
                  {pinnedTableRows.map((row) => (
                    <DraggableRow key={row.id} row={row} isPinned={true} />
                  ))}
                  {/* Unpinned Rows */}
                  {unpinnedTableRows.map((row) => (
                    <DraggableRow key={row.id} row={row} isPinned={false} />
                  ))}
                </SortableContext>
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
        </DndContext>
      </div>
      <DataTablePagination table={table} className="mt-auto" />
      <DataTableBulkActions table={table} />
    </div>
  );
}
