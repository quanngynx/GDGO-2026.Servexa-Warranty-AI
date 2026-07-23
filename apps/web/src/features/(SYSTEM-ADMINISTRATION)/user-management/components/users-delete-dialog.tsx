'use client'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { Alert, AlertDescription, AlertTitle } from '@servexa-warranty-ai/ui/components/alert'
import { Input } from '@servexa-warranty-ai/ui/components/input'
import { Label } from '@servexa-warranty-ai/ui/components/label'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { type User } from '../data/schema'
import { useDeleteUserMutation } from '../hooks/use-delete-user-mutation'
import { useTranslation } from "react-i18next";

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: UserDeleteDialogProps) {
    const { t } = useTranslation();
  const [value, setValue] = useState('')
  const { mutate, isPending } = useDeleteUserMutation()

  const handleDelete = () => {
    if (value.trim() !== currentRow.username) return

    mutate(currentRow.id, {
      onSuccess: () => {
        setValue('')
        onOpenChange(false)
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.username || isPending}
      isLoading={isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle className='me-1 inline-block stroke-destructive' size={18} />{' '}
          {t("Delete User")}</span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t("Are you sure you want to delete")}{' '}
            <span className='font-bold'>{currentRow.username}</span>?
            <br />
            {t("This action will permanently remove the user with the role of")}{' '}
            <span className='font-bold'>{currentRow.role.toUpperCase()}</span> {t("from the\n system. This cannot be undone.")}</p>

          <Label className='my-2'>
            {t("Username:")}<Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("Enter username to confirm deletion.")}
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
