import { ProductsActionDialog } from './products-action-dialog'
import { ProductsDeleteDialog } from './products-delete-dialog'
import { ProductsInviteDialog } from './products-invite-dialog'
import { ProductsImportDialog } from './products-import-dialog'
import { ProductsRestoreDialog } from './products-restore-dialog'
import { useProducts } from './products-provider'

export function ProductsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProducts()
  return (
    <>
      <ProductsActionDialog
        key='model-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      <ProductsImportDialog
        key='model-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      <ProductsInviteDialog
        key='model-invite'
        open={open === 'invite'}
        onOpenChange={() => setOpen('invite')}
      />

      {currentRow && (
        <>
          <ProductsActionDialog
            key={`model-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ProductsDeleteDialog
            key={`model-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
          
          <ProductsRestoreDialog
            key={`model-restore-${currentRow.id}`}
            open={open === 'restore'}
            onOpenChange={() => {
              setOpen('restore')
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
