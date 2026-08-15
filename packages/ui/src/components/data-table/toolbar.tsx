import { useEffect, useRef, useState } from "react";
import { Button } from "../button";
import { type Table } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { DataTableFacetedFilter } from "./faceted-filter";
import { DataTableViewOptions } from "./view-options";
import { DebouncedSearchInput } from "./debounced-search-input";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  searchPlaceholder?: string;
  /** TanStack column id for the text filter (must match useTableUrlState `columnId`). */
  filterColumnId?: string;
  /** @deprecated Use `filterColumnId`. Kept for tables where column id equals URL key. */
  searchKey?: string;
  /** Debounce delay before URL/API search updates (ms). Default 500. */
  searchDebounceMs?: number;
  filters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  children?: React.ReactNode;
  isFiltered?: boolean;
  onResetFilters?: () => void;
};

const searchInputClassName = "h-8 w-[150px] lg:w-[220px] shrink-0";

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Filter...",
  filterColumnId,
  searchKey,
  searchDebounceMs = 500,
  filters = [],
  children,
  isFiltered,
  onResetFilters,
}: DataTableToolbarProps<TData>) {
  const textFilterColumnId = filterColumnId ?? searchKey;
  const isTableFiltered =
    table.getState().columnFilters.length > 0 ||
    !!table.getState().globalFilter;
  const showReset =
    isFiltered !== undefined ? isFiltered || isTableFiltered : isTableFiltered;

  const textFilterValue = textFilterColumnId
    ? ((table.getColumn(textFilterColumnId)?.getFilterValue() as string) ?? "")
    : (table.getState().globalFilter ?? "");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [filters, children, showReset]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -200 : 200;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="flex items-center justify-between gap-2 w-full overflow-hidden">
      <div className="flex flex-1 items-center gap-2 min-w-0">
        {textFilterColumnId ? (
          <DebouncedSearchInput
            value={textFilterValue}
            onDebouncedChange={(next) =>
              table.getColumn(textFilterColumnId)?.setFilterValue(next)
            }
            placeholder={searchPlaceholder}
            debounceMs={searchDebounceMs}
            className={searchInputClassName}
          />
        ) : (
          <DebouncedSearchInput
            value={textFilterValue}
            onDebouncedChange={(next) => table.setGlobalFilter(next)}
            placeholder={searchPlaceholder}
            debounceMs={searchDebounceMs}
            className={searchInputClassName}
          />
        )}

        <div className="relative flex flex-1 items-center min-w-0">
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full shrink-0 z-10 mr-1 bg-background"
              onClick={() => scroll("left")}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 min-w-0 flex-1 whitespace-nowrap scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filters.map((filter) => {
              const column = table.getColumn(filter.columnId);
              if (!column) return null;
              return (
                <DataTableFacetedFilter
                  key={filter.columnId}
                  column={column}
                  title={filter.title}
                  options={filter.options}
                />
              );
            })}
            {children}
            {showReset && (
              <Button
                variant="outline"
                onClick={() => {
                  table.resetColumnFilters();
                  table.setGlobalFilter("");
                  onResetFilters?.();
                }}
                className="h-8 px-2 lg:px-3 shrink-0"
              >
                Reset
                <XIcon className="ms-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full shrink-0 z-10 ml-1 bg-background"
              onClick={() => scroll("right")}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
