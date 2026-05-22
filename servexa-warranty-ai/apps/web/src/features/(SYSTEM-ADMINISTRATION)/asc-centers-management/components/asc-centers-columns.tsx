import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@servexa-warranty-ai/ui/lib/utils'
import { Badge } from '@servexa-warranty-ai/ui/components/badge'
import { Checkbox } from '@servexa-warranty-ai/ui/components/checkbox'
import { DataTableColumnHeader } from '@servexa-warranty-ai/ui/components/data-table'
import { LongText } from '@/components/long-text'
import { statusTypes } from '../data/data'
import { type AscCenter } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const ascCentersColumns: ColumnDef<AscCenter>[] = [
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
    accessorKey: 'centerName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Center Name' />,
    cell: ({ row }) => (
      <LongText className='max-w-48 ps-3'>{row.getValue('centerName')}</LongText>
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
    accessorKey: 'centerCode',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Center Code' />,
    cell: ({ row }) => <div className='font-mono text-sm'>{row.getValue('centerCode')}</div>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
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
    id: 'actions',
    cell: DataTableRowActions,
  },
]
