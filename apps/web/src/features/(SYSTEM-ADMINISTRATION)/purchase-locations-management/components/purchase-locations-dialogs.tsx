import { PurchaseLocationActionDialog } from './purchase-location-action-dialog'
import { PurchaseLocationGroupActionDialog } from './purchase-location-group-action-dialog'
import { PurchaseLocationsDeleteDialog } from './purchase-locations-delete-dialog'
import { PurchaseLocationsInviteDialog } from './purchase-locations-invite-dialog'
import { usePurchaseLocations } from './purchase-locations-provider'

export function PurchaseLocationsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePurchaseLocations()
  return (
    <>
      <PurchaseLocationActionDialog
        key='location-add'
        open={open === 'add-location'}
        onOpenChange={() => setOpen('add-location')}
      />

      <PurchaseLocationGroupActionDialog
        key='group-add'
        open={open === 'add-group'}
        onOpenChange={() => setOpen('add-group')}
      />

      <PurchaseLocationsInviteDialog
        key='location-invite'
        open={open === 'invite'}
        onOpenChange={() => setOpen('invite')}
      />

      {currentRow && (
        <>
          <PurchaseLocationActionDialog
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
