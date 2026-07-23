import { ConfirmDialog } from '@/components/confirm-dialog'
import { Alert, AlertDescription, AlertTitle } from '@servexa-warranty-ai/ui/components/alert'
import { RotateCcw } from 'lucide-react'
import { type Model } from '../data/schema'
import { useRestoreModelMutation } from '../hooks/use-restore-model-mutation'
import { useTranslation } from "react-i18next";

type ProductsRestoreDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Model
}

export function ProductsRestoreDialog({
  open,
  onOpenChange,
  currentRow,
}: ProductsRestoreDialogProps) {
  const { t } = useTranslation();
  const { mutate, isPending } = useRestoreModelMutation()

  const handleRestore = () => {
    mutate(currentRow.id, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleRestore}
      disabled={isPending}
      isLoading={isPending}
      title={
        <span className='text-primary'>
          <RotateCcw className='me-1 inline-block' size={18} />{' '}
          {t("Restore Model")}</span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t("Are you sure you want to restore")}{' '}
            <span className='font-bold'>{currentRow.name}</span> (
            <span className='font-mono'>{currentRow.modelCode}</span>{t(")?")}
          </p>

          <Alert>
            <AlertTitle>{t("Information")}</AlertTitle>
            <AlertDescription>
              {t("This model will become active again and available for selection.")}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t("Restore")}
    />
  )
}
