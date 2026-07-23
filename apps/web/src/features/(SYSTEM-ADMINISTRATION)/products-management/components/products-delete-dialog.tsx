import { ConfirmDialog } from '@/components/confirm-dialog'
import { Alert, AlertDescription, AlertTitle } from '@servexa-warranty-ai/ui/components/alert'
import { Input } from '@servexa-warranty-ai/ui/components/input'
import { Label } from '@servexa-warranty-ai/ui/components/label'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { type Model } from '../data/schema'
import { useDeleteModelMutation } from '../hooks/use-delete-model-mutation'
import { useTranslation } from "react-i18next";

type ProductsDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Model
}

export function ProductsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ProductsDeleteDialogProps) {
    const { t } = useTranslation();
  const [value, setValue] = useState('')
  const { mutate, isPending } = useDeleteModelMutation()

  const handleDelete = () => {
    if (value.trim() !== currentRow.modelCode) return

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
      disabled={value.trim() !== currentRow.modelCode || isPending}
      isLoading={isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle className='me-1 inline-block stroke-destructive' size={18} />{' '}
          {t("Delete Model")}</span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t("Are you sure you want to delete")}{' '}
            <span className='font-bold'>{currentRow.name}</span> (
            <span className='font-mono'>{currentRow.modelCode}</span>{t(")? This cannot be undone.")}</p>

          <Label className='my-2'>
            {t("Model code:")}<Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("Enter model code to confirm deletion.")}
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
