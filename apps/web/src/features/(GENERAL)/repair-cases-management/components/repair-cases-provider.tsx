import React, { useState } from 'react'
import useDialogState from '@servexa-warranty-ai/ui/hooks/use-dialog-state'
import type { RepairCaseDto } from '@/libs/api/asc-center/repair-case/data-transfer-object'

type RepairCaseDialogType = 'add' | 'delete' | 'export-excel'

type RepairCasesContextType = {
  open: RepairCaseDialogType | null
  setOpen: (value: RepairCaseDialogType | null) => void
  currentRow: RepairCaseDto | null
  setCurrentRow: React.Dispatch<React.SetStateAction<RepairCaseDto | null>>
}

const RepairCasesContext = React.createContext<RepairCasesContextType | null>(null)

export function RepairCasesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<RepairCaseDialogType>(null)
  const [currentRow, setCurrentRow] = useState<RepairCaseDto | null>(null)

  return (
    <RepairCasesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RepairCasesContext>
  )
}

export const useRepairCases = () => {
  const context = React.useContext(RepairCasesContext)
  if (!context) {
    throw new Error('useRepairCases must be used within RepairCasesProvider')
  }
  return context
}
