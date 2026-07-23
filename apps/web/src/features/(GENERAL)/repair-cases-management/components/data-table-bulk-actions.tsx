import { useState } from 'react'
import type { Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@servexa-warranty-ai/ui/components/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@servexa-warranty-ai/ui/components/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@servexa-warranty-ai/ui/components/data-table'
import { RepairCasesMultiDeleteDialog } from './repair-cases-multi-delete-dialog'
import { useTranslation } from "react-i18next";

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({ table }: DataTableBulkActionsProps<TData>) {
    const { t } = useTranslation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <>
      <BulkActionsToolbar table={table} entityName='repair case'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected repair cases'
              title={t("Delete selected repair cases")}
            >
              <Trash2 />
              <span className='sr-only'>{t("Delete selected repair cases")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("Delete selected repair cases")}</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <RepairCasesMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
