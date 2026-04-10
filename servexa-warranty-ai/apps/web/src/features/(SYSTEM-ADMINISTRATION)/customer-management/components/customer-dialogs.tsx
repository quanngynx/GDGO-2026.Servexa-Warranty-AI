import { CustomersActionDialog } from "./customer-action-dialog";
import { CustomersDeleteDialog } from "./customer-delete-dialog";
import { useCustomers } from "./customer-provider";

export function CustomersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCustomers();
  return (
    <>
      <CustomersActionDialog
        key="customer-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      {currentRow && (
        <>
          <CustomersActionDialog
            key={`customer-edit-${currentRow.id}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <CustomersDeleteDialog
            key={`customer-delete-${currentRow.id}`}
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
