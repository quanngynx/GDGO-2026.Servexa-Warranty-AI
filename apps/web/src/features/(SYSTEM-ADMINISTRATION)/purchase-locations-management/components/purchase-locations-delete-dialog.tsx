import { ConfirmDialog } from '@/components/confirm-dialog'
import { Alert, AlertDescription, AlertTitle } from '@servexa-warranty-ai/ui/components/alert'
import { Input } from '@servexa-warranty-ai/ui/components/input'
import { Label } from '@servexa-warranty-ai/ui/components/label'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { type PurchaseLocation } from '../data/schema'
import { useDeletePurchaseLocationMutation } from '../hooks/use-delete-purchase-location-mutation'

type PurchaseLocationsDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: PurchaseLocation
}

export function PurchaseLocationsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: PurchaseLocationsDeleteDialogProps) {
  const [value, setValue] = useState('')
  const { mutate, isPending } = useDeletePurchaseLocationMutation()

  const handleDelete = () => {
    if (value.trim() !== currentRow.code) return

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
      disabled={value.trim() !== currentRow.code || isPending}
      isLoading={isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle className='me-1 inline-block stroke-destructive' size={18} />{' '}
          Delete Purchase Location
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.name}</span> (
            <span className='font-mono'>{currentRow.code}</span>)? This cannot be undone.
          </p>

          <Label className='my-2'>
            Location code:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter location code to confirm deletion.'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
