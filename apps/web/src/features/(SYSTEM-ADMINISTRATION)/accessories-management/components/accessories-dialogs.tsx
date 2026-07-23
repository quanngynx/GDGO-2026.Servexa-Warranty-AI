import { AccessoriesActionDialog } from './accessories-action-dialog'
import { AccessoriesDeleteDialog } from './accessories-delete-dialog'
import { useAccessories } from './accessories-provider'

export function AccessoriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useAccessories()
  return (
    <>
      <AccessoriesActionDialog
        key='accessory-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <AccessoriesActionDialog
            key={`accessory-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <AccessoriesDeleteDialog
            key={`accessory-delete-${currentRow.id}`}
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
