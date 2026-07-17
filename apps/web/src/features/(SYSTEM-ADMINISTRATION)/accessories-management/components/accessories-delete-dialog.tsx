'use client'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { Alert, AlertDescription, AlertTitle } from '@servexa-warranty-ai/ui/components/alert'
import { Input } from '@servexa-warranty-ai/ui/components/input'
import { Label } from '@servexa-warranty-ai/ui/components/label'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { type Accessory } from '../data/schema'
import { useTranslation } from "react-i18next";

type AccessoriesDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Accessory
}

export function AccessoriesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: AccessoriesDeleteDialogProps) {
    const { t } = useTranslation();
  const [value, setValue] = useState('')

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return

    toast.error('Accessory deletion is not available on the server API yet.')
    setValue('')
    onOpenChange(false)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name}
      title={
        <span className='text-destructive'>
          <AlertTriangle className='me-1 inline-block stroke-destructive' size={18} /> {t("Delete\n Accessory")}</span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t("Are you sure you want to delete")}<span className='font-bold'>{currentRow.name}</span>{t("?\n This cannot be undone.")}</p>

          <Label className='my-2'>
            {t("Accessory name:")}<Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("Enter accessory name to confirm deletion.")}
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
