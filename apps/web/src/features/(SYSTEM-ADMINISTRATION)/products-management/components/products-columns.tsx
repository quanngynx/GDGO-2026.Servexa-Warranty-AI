import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@servexa-warranty-ai/ui/lib/utils'
import { formatIsoDateTime } from '@servexa-warranty-ai/ui/lib/format-time'
import { Badge } from '@servexa-warranty-ai/ui/components/badge'
import { Checkbox } from '@servexa-warranty-ai/ui/components/checkbox'
import { DataTableColumnHeader } from '@servexa-warranty-ai/ui/components/data-table'
import { LongText } from '@/components/long-text'
import { statusTypes } from '../data/data'
import { type Model } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { t } from "i18next";

export const productsColumns: ColumnDef<Model>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("Name")} />,
    cell: ({ row }) => (
      <LongText className='max-w-48 ps-3'>{row.getValue('name')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none',
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'modelCode',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("Model Code")} />,
    cell: ({ row }) => <div className='font-mono text-sm'>{row.getValue('modelCode')}</div>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("Status")} />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const badgeColor = statusTypes.get(status) ?? ''
      return (
        <Badge variant='outline' className={cn('capitalize', badgeColor)}>
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
  },
  {
    id: 'categoryName',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("Category")} />,
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.original.category?.name ?? '—'}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("Created At")} />,
    cell: ({ row }) => (
      <LongText className='max-w-36'>{formatIsoDateTime(row.getValue('createdAt')) ?? '—'}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("Updated At")} />,
    cell: ({ row }) => (
      <LongText className='max-w-36'>{formatIsoDateTime(row.getValue('updatedAt')) ?? '—'}</LongText>
    ),
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
