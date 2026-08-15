import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@servexa-warranty-ai/ui/lib/utils'
import { Badge } from '@servexa-warranty-ai/ui/components/badge'
import { Checkbox } from '@servexa-warranty-ai/ui/components/checkbox'
import { DataTableColumnHeader } from '@servexa-warranty-ai/ui/components/data-table'
import { LongText } from '@/components/long-text'
import { Package } from 'lucide-react'
import { statusTypes } from '../data/data'
import { type Accessory } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { t } from "i18next";

const formatCurrency = (val?: number | string | null) => {
  if (val === undefined || val === null || val === '') return '—'
  const num = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(num)) return '—'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num)
}

export const accessoriesColumns: ColumnDef<Accessory>[] = [
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
    id: 'image',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("Image")} />,
    cell: ({ row }) => {
      const item = row.original
      const accessoryObj = item.accessory || item
      const imageUrl = accessoryObj.imageUrl || item.imageUrl

      return (
        <div className='flex items-center justify-center h-10 w-10 rounded-md border bg-muted overflow-hidden shrink-0'>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={accessoryObj.name || 'Accessory image'}
              className='h-full w-full object-cover'
              onError={(e) => {
                // Fallback on broken image load
                e.currentTarget.style.display = 'none'
                const parent = e.currentTarget.parentElement
                if (parent) {
                  parent.classList.add('flex', 'items-center', 'justify-center')
                }
              }}
            />
          ) : (
            <Package className='h-5 w-5 text-muted-foreground' />
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("Name")} />,
    cell: ({ row }) => {
      const item = row.original
      const accessoryObj = item.accessory || item
      const name = accessoryObj.name || item.name
      const englishName = accessoryObj.englishName || item.englishName
      return (
        <div className='flex flex-col max-w-48 ps-1'>
          <LongText className='font-medium text-foreground'>{name}</LongText>
          {englishName && (
            <span className='text-xs text-muted-foreground truncate'>{englishName}</span>
          )}
        </div>
      )
    },
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none',
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'partNumber',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("Part Number")} />,
    cell: ({ row }) => {
      const item = row.original
      const accessoryObj = item.accessory || item
      const partNumber = accessoryObj.partNumber || item.partNumber
      return <LongText className='max-w-36 font-mono text-xs'>{partNumber ?? '—'}</LongText>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'itemNumber',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("Item Number")} />,
    cell: ({ row }) => {
      const item = row.original
      const accessoryObj = item.accessory || item
      const itemNumber = accessoryObj.itemNumber || item.itemNumber
      return <span className='text-xs text-muted-foreground'>{itemNumber ?? '—'}</span>
    },
    enableSorting: false,
  },
  {
    id: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("Category")} />,
    cell: ({ row }) => {
      const item = row.original
      const accessoryObj = item.accessory || item
      const categoryName = accessoryObj.category?.name
      return (
        <span className='text-xs font-medium'>
          {categoryName ? <Badge variant='secondary'>{categoryName}</Badge> : '—'}
        </span>
      )
    },
    enableSorting: false,
  },
  {
    id: 'prices',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("Unit Price / Customer Price")} />,
    cell: ({ row }) => {
      const item = row.original
      const accessoryObj = item.accessory || item
      const unitPrice = accessoryObj.unitPrice || item.unitPrice
      const customerPrice = accessoryObj.customerPrice || item.customerPrice

      return (
        <div className='flex flex-col text-xs'>
          <span className='font-medium text-foreground'>{formatCurrency(unitPrice)}</span>
          {customerPrice && (
            <span className='text-muted-foreground text-[11px]'>
              Cust: {formatCurrency(customerPrice)}
            </span>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'stock',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("Stock")} />,
    cell: ({ row }) => {
      const item = row.original
      const currentStock = item.currentStock
      const availableStock = item.availableStock
      const isLowStock = item.isLowStock

      if (currentStock === undefined) {
        return <span className='text-xs text-muted-foreground'>—</span>
      }

      return (
        <div className='flex flex-col text-xs gap-0.5'>
          <div className='flex items-center gap-1.5'>
            <span className='font-bold'>{currentStock}</span>
            {isLowStock && (
              <Badge variant='destructive' className='text-[10px] px-1 py-0 h-4'>
                Low
              </Badge>
            )}
          </div>
          {availableStock !== undefined && (
            <span className='text-[11px] text-muted-foreground'>Avail: {availableStock}</span>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("Status")} />,
    cell: ({ row }) => {
      const item = row.original
      const accessoryObj = item.accessory || item
      const status = (accessoryObj.status || item.status || 'active') as string
      const badgeColor = statusTypes.get(status) ?? ''
      return (
        <Badge variant='outline' className={cn('capitalize text-xs', badgeColor)}>
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
