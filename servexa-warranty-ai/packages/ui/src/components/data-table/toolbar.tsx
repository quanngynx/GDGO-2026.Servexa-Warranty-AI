import { Button } from '../button'
import { type Table } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'
import { DataTableFacetedFilter } from './faceted-filter'
import { DataTableViewOptions } from './view-options'
import { DebouncedSearchInput } from './debounced-search-input'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
  /** TanStack column id for the text filter (must match useTableUrlState `columnId`). */
  filterColumnId?: string
  /** @deprecated Use `filterColumnId`. Kept for tables where column id equals URL key. */
  searchKey?: string
  /** Debounce delay before URL/API search updates (ms). Default 500. */
  searchDebounceMs?: number
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
}

const searchInputClassName = 'h-8 w-[150px] lg:w-[250px]'

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  filterColumnId,
  searchKey,
  searchDebounceMs = 500,
  filters = [],
}: DataTableToolbarProps<TData>) {
  const textFilterColumnId = filterColumnId ?? searchKey
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter

  const textFilterValue = textFilterColumnId
    ? ((table.getColumn(textFilterColumnId)?.getFilterValue() as string) ?? '')
    : (table.getState().globalFilter ?? '')

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
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
        <div className="flex gap-x-2">
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return null
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          })}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter('')
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
