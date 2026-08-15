import { Button } from '@servexa-warranty-ai/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@servexa-warranty-ai/ui/components/dropdown-menu'
import { type Row } from '@tanstack/react-table'
import { MoreHorizontal, Trash2, Warehouse } from 'lucide-react'
import { type TotalWarehouse } from '../data/schema'
import { useCentralWarehouse } from './central-warehouse-provider'
import { useTranslation } from "react-i18next";

type DataTableRowActionsProps = {
  row: Row<TotalWarehouse>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { t } = useTranslation();
  const { setOpen, setCurrentRow } = useCentralWarehouse()
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>{t("Open menu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('edit')
          }}
        >
          {t("Edit")}<DropdownMenuShortcut>
            <Warehouse size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('delete')
          }}
          className='text-red-500!'
        >
          {t("Delete")}<DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
