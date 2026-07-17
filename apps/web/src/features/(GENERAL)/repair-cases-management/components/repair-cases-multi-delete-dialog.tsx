import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import type { Table } from '@tanstack/react-table'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Alert, AlertDescription, AlertTitle } from '@servexa-warranty-ai/ui/components/alert'
import { Input } from '@servexa-warranty-ai/ui/components/input'
import { Label } from '@servexa-warranty-ai/ui/components/label'
import type { RepairCaseDto } from '@/libs/api/asc-center/repair-case/data-transfer-object'
import { repairCaseAPI } from '@/libs/api/asc-center/repair-case/api'
import { repairCaseQueryKeys } from '../hooks/query-keys'
import { useTranslation } from "react-i18next";

type RepairCasesMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function RepairCasesMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: RepairCasesMultiDeleteDialogProps<TData>) {
    const { t } = useTranslation();
  const [value, setValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCases = selectedRows.map((row) => row.original as RepairCaseDto)

  const handleDelete = async () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }

    setIsDeleting(true)
    onOpenChange(false)

    try {
      await Promise.all(
        selectedCases.map((repairCase) => repairCaseAPI.deleteRepairCase(repairCase.id)),
      )
      await queryClient.invalidateQueries({ queryKey: repairCaseQueryKeys.lists() })
      setValue('')
      table.resetRowSelection()
      toast.success(
        `Deleted ${selectedCases.length} repair case${selectedCases.length > 1 ? 's' : ''}`,
      )
    } catch {
      toast.error('Failed to delete one or more repair cases')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD || isDeleting}
      title={
        <span className='text-destructive'>
          <AlertTriangle className='me-1 inline-block stroke-destructive' size={18} /> {t("Delete")}{' '}
          {selectedRows.length} {t("repair case")}{selectedRows.length > 1 ? 's' : ''}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t("Are you sure you want to delete the selected repair cases?")}<br />
            {t("This action cannot be undone.")}</p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span>{t("Confirm by typing &quot;")}{CONFIRM_WORD}{t("&quot;:")}</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>{t("Warning!")}</AlertTitle>
            <AlertDescription>
              {t("Please be careful, this operation can not be rolled back.")}</AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
