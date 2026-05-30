import { UsersActionDialog } from './permissions-action-dialog'
import { PermissionsDeleteDialog } from './permissions-delete-dialog'
import { UsersInviteDialog } from './permissions-invite-dialog'
import { usePermissions } from './permissions-provider'

export function PermissionsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePermissions()
  return (
    <>
      <UsersActionDialog
        key="user-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      <UsersInviteDialog
        key="user-invite"
        open={open === "invite"}
        onOpenChange={() => setOpen("invite")}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <PermissionsDeleteDialog
            key={`user-delete-${currentRow.id}`}
            open={open === "delete"}
            onOpenChange={() => {
              setOpen("delete");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}
