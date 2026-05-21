import { AscCentersActionDialog } from './asc-centers-action-dialog'
import { AscCentersDeleteDialog } from './asc-centers-delete-dialog'
import { AscCentersInviteDialog } from './asc-centers-invite-dialog'
import { useAscCenters } from './asc-centers-provider'

export function AscCentersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useAscCenters()
  return (
    <>
      <AscCentersActionDialog
        key='asc-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      <AscCentersInviteDialog
        key='asc-invite'
        open={open === 'invite'}
        onOpenChange={() => setOpen('invite')}
      />

      {currentRow && (
        <>
          <AscCentersActionDialog
            key={`asc-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <AscCentersDeleteDialog
            key={`asc-delete-${currentRow.id}`}
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
