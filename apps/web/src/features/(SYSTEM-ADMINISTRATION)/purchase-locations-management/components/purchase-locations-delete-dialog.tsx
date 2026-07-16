import { ConfirmDialog } from '@/components/confirm-dialog'
import { Alert, AlertDescription, AlertTitle } from '@servexa-warranty-ai/ui/components/alert'
import { AlertTriangle, MapPin, Hash, Building2, Globe, Wrench } from 'lucide-react'
import { useDeletePurchaseLocationMutation } from '../hooks/use-delete-purchase-location-mutation'
import type { ResponsePurchaseLocationDto } from '@/libs/api/purchase-channels/purchase-location/data-transfer-object'

type PurchaseLocationsDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: ResponsePurchaseLocationDto
}

export function PurchaseLocationsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: PurchaseLocationsDeleteDialogProps) {
  const { mutate, isPending } = useDeletePurchaseLocationMutation()

  const handleDelete = () => {
    mutate(currentRow.id, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  const repairCasesCount = currentRow._count?.repairCases || 0

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={isPending}
      isLoading={isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle className='me-1 inline-block stroke-destructive' size={18} aria-hidden='true' />{' '}
          Delete Purchase Location
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p>
            Are you sure you want to delete this purchase location? This action cannot be undone.
          </p>

          <div className='rounded-lg border bg-card text-card-foreground p-4 space-y-3'>
            <div className='flex items-start gap-2 font-semibold text-lg pb-2 border-b'>
              <MapPin className='h-5 w-5 mt-0.5 text-muted-foreground shrink-0' aria-hidden='true' />
              <span className='break-words min-w-0 flex-1'>{currentRow.name}</span>
            </div>

            <div className='grid grid-cols-[120px_1fr] gap-x-3 gap-y-2 text-sm'>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Hash className='h-4 w-4 shrink-0' aria-hidden='true' />
                <span>Code:</span>
              </div>
              <div className='font-medium break-all'>{currentRow.code}</div>

              <div className='flex items-center gap-2 text-muted-foreground'>
                <Building2 className='h-4 w-4 shrink-0' aria-hidden='true' />
                <span>Group:</span>
              </div>
              <div className='font-medium break-words'>{currentRow.group?.name || 'N/A'}</div>

              <div className='flex items-center gap-2 text-muted-foreground'>
                <Globe className='h-4 w-4 shrink-0' aria-hidden='true' />
                <span>Website:</span>
              </div>
              <div className='font-medium break-all'>{currentRow.website || 'N/A'}</div>

              <div className='flex items-center gap-2 text-muted-foreground'>
                <Wrench className='h-4 w-4 shrink-0' aria-hidden='true' />
                <span>Repair tickets:</span>
              </div>
              <div className='font-medium'>{repairCasesCount}</div>
            </div>
          </div>

          {repairCasesCount > 0 ? (
            <Alert variant='destructive'>
              <AlertTitle>Warning!</AlertTitle>
              <AlertDescription>
                This location has been used in <strong>{repairCasesCount}</strong> repair tickets. Please consider carefully before deleting.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant='destructive'>
              <AlertTitle>Warning!</AlertTitle>
              <AlertDescription>
                Please be careful, this operation cannot be rolled back.
              </AlertDescription>
            </Alert>
          )}
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
