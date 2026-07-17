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
        <span className='flex items-center gap-2 text-destructive font-semibold tracking-tight'>
          <AlertTriangle className='stroke-destructive shrink-0' size={20} aria-hidden='true' />
          Delete Purchase Location
        </span>
      }
      desc={
        <div className='space-y-5 mt-1'>
          <p className="leading-relaxed">
            Are you sure you want to delete this purchase location? This action cannot be undone.
          </p>

          <div className='rounded-[var(--radius)] border border-border/40 bg-muted/30 p-4 space-y-3 ring-1 ring-inset ring-border/20 shadow-sm'>
            <div className='flex items-center gap-2 font-semibold text-[15px] pb-3 border-b border-border/40'>
              <MapPin className='h-4 w-4 text-muted-foreground shrink-0' aria-hidden='true' />
              <span className='break-words min-w-0 flex-1 text-foreground'>{currentRow.name}</span>
            </div>

            <div className='grid grid-cols-[120px_1fr] gap-x-3 gap-y-2.5 text-[13px]'>
              <div className='flex items-center gap-2 text-muted-foreground font-medium'>
                <Hash className='h-3.5 w-3.5 shrink-0' aria-hidden='true' />
                <span>Code:</span>
              </div>
              <div className='font-semibold text-foreground break-all'>{currentRow.code}</div>

              <div className='flex items-center gap-2 text-muted-foreground font-medium'>
                <Building2 className='h-3.5 w-3.5 shrink-0' aria-hidden='true' />
                <span>Group:</span>
              </div>
              <div className='font-semibold text-foreground break-words'>{currentRow.group?.name || 'N/A'}</div>

              <div className='flex items-center gap-2 text-muted-foreground font-medium'>
                <Globe className='h-3.5 w-3.5 shrink-0' aria-hidden='true' />
                <span>Website:</span>
              </div>
              <div className='font-semibold text-foreground break-all'>{currentRow.website || 'N/A'}</div>

              <div className='flex items-center gap-2 text-muted-foreground font-medium'>
                <Wrench className='h-3.5 w-3.5 shrink-0' aria-hidden='true' />
                <span>Repair tickets:</span>
              </div>
              <div className='font-semibold text-foreground'>{repairCasesCount}</div>
            </div>
          </div>

          {repairCasesCount > 0 ? (
            <Alert variant='destructive' className="border-destructive/20 bg-destructive/5 text-destructive ring-1 ring-inset ring-destructive/10">
              <AlertTitle className="text-[14px] font-semibold flex items-center gap-2">Warning!</AlertTitle>
              <AlertDescription className="text-[13px] font-medium leading-relaxed opacity-90 mt-1">
                This location has been used in <strong className="font-bold">{repairCasesCount}</strong> repair tickets. Please consider carefully before deleting.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant='destructive' className="border-destructive/20 bg-destructive/5 text-destructive ring-1 ring-inset ring-destructive/10">
              <AlertTitle className="text-[14px] font-semibold flex items-center gap-2">Warning!</AlertTitle>
              <AlertDescription className="text-[13px] font-medium leading-relaxed opacity-90 mt-1">
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
