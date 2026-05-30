import { CentralWarehouseActionDialog } from './central-warehouse-action-dialog'
import { CentralWarehouseDeleteDialog } from './central-warehouse-delete-dialog'
import { CentralWarehouseInviteDialog } from './central-warehouse-invite-dialog'
import { useCentralWarehouse } from './central-warehouse-provider'

export function CentralWarehouseDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCentralWarehouse()
  return (
    <>
      <CentralWarehouseActionDialog
        key='warehouse-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      <CentralWarehouseInviteDialog
        key='warehouse-invite'
        open={open === 'invite'}
        onOpenChange={() => setOpen('invite')}
      />

      {currentRow && (
        <>
          <CentralWarehouseActionDialog
            key={`warehouse-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <CentralWarehouseDeleteDialog
            key={`warehouse-delete-${currentRow.id}`}
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
