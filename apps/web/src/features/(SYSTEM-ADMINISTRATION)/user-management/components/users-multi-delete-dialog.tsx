import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Alert, AlertDescription, AlertTitle } from '@servexa-warranty-ai/ui/components/alert'
import { Input } from '@servexa-warranty-ai/ui/components/input'
import { Label } from '@servexa-warranty-ai/ui/components/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { userAPI } from '@/libs/api/identity/user/api'
import { userQueryKeys } from '../hooks/query-keys'
import { type User } from '../data/schema'
import { useTranslation } from "react-i18next";

type UserMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function UsersMultiDeleteDialog<TData>({ open, onOpenChange, table }: UserMultiDeleteDialogProps<TData>) {
    const { t } = useTranslation();
  const [value, setValue] = useState('')
  const [isPending, setIsPending] = useState(false)
  const queryClient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = async () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }

    setIsPending(true)
    try {
      await Promise.all(selectedRows.map((row) => userAPI.deleteUser((row.original as User).id)))
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
      setValue('')
      table.resetRowSelection()
      onOpenChange(false)
      toast.success(
        `Deleted ${selectedRows.length} ${selectedRows.length > 1 ? 'users' : 'user'}`
      )
    } catch {
      toast.error('Failed to delete some users. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD || isPending}
      isLoading={isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle className='me-1 inline-block stroke-destructive' size={18} />{' '}
          {t("Delete")}{selectedRows.length} {selectedRows.length > 1 ? 'users' : 'user'}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t("Are you sure you want to delete the selected users?")}<br />
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
