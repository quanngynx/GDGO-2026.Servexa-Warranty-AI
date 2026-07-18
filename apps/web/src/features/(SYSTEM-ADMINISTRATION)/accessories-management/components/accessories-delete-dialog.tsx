'use client'

import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Alert, AlertDescription, AlertTitle } from '@servexa-warranty-ai/ui/components/alert'
import { Input } from '@servexa-warranty-ai/ui/components/input'
import { Label } from '@servexa-warranty-ai/ui/components/label'
import { type Accessory } from '../data/schema'
import { useDeleteAccessoryMutation } from '../hooks/use-delete-accessory-mutation'

const route = getRouteApi('/_authenticated/(SYSTEM-ADMINISTRATION)/accessories-management/')

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
  const { t } = useTranslation()
  const search = route.useSearch()

  const totalWarehouseId = search.totalWarehouseIds?.split(',')[0]
  const ascCenterId = search.ascCenterIds?.split(',')[0]

  const [value, setValue] = useState('')
  const deleteMutation = useDeleteAccessoryMutation()

  const accessoryObj = currentRow.accessory || currentRow
  const accessoryName = accessoryObj.name || currentRow.name || ''
  const accessoryId = currentRow.accessoryId || currentRow.id

  const handleDelete = async () => {
    if (value.trim() !== accessoryName) return

    await deleteMutation.mutateAsync({
      accessoryId,
      totalWarehouseId,
      ascCenterId,
    })

    setValue('')
    onOpenChange(false)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(state) => {
        setValue('')
        onOpenChange(state)
      }}
      handleConfirm={handleDelete}
      disabled={value.trim() !== accessoryName || deleteMutation.isPending}
      isLoading={deleteMutation.isPending}
      title={
        <span className='text-destructive flex items-center gap-1.5'>
          <AlertTriangle className='inline-block stroke-destructive' size={18} />
          {t('Delete Accessory')}
        </span>
      }
      desc={
        <div className='space-y-4 text-start'>
          <p className='mb-2'>
            {t('Are you sure you want to delete ')}
            <span className='font-bold'>{accessoryName}</span>
            {t('? This action cannot be undone.')}
          </p>

          <Label className='my-2 block space-y-1'>
            <span>{t('Accessory name confirmation:')}</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('Enter accessory name to confirm.')}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>{t('Warning!')}</AlertTitle>
            <AlertDescription>
              {t('Please be careful, this operation cannot be rolled back.')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('Delete')}
      destructive
    />
  )
}
