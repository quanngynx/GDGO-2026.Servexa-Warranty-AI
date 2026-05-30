import { PurchaseLocationsActionDialog } from './purchase-locations-action-dialog'
import { PurchaseLocationsDeleteDialog } from './purchase-locations-delete-dialog'
import { PurchaseLocationsInviteDialog } from './purchase-locations-invite-dialog'
import { usePurchaseLocations } from './purchase-locations-provider'

export function PurchaseLocationsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePurchaseLocations()
  return (
    <>
      <PurchaseLocationsActionDialog
        key='location-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      <PurchaseLocationsInviteDialog
        key='location-invite'
        open={open === 'invite'}
        onOpenChange={() => setOpen('invite')}
      />

      {currentRow && (
        <>
          <PurchaseLocationsActionDialog
            key={`location-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <PurchaseLocationsDeleteDialog
            key={`location-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
