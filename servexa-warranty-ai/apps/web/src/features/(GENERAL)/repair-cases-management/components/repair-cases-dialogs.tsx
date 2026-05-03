import { RepairCasesActionDialog } from './repair-cases-action-dialog'
import { RepairCasesDeleteDialog } from './repair-cases-delete-dialog'
import { useRepairCases } from './repair-cases-provider'

export function RepairCasesDialogs() {
  const { currentRow } = useRepairCases()

  return (
    <>
      <RepairCasesActionDialog />
      {currentRow && <RepairCasesDeleteDialog />}
    </>
  )
}
