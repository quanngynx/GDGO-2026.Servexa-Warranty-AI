import React, { useState } from 'react'
import useDialogState from '@servexa-warranty-ai/ui/hooks/use-dialog-state'
import { type TotalWarehouse } from '../data/schema'

type CentralWarehouseDialogType = 'invite' | 'add' | 'edit' | 'delete'

type CentralWarehouseContextType = {
  open: CentralWarehouseDialogType | null
  setOpen: (str: CentralWarehouseDialogType | null) => void
  currentRow: TotalWarehouse | null
  setCurrentRow: React.Dispatch<React.SetStateAction<TotalWarehouse | null>>
}

const CentralWarehouseContext = React.createContext<CentralWarehouseContextType | null>(null)

export function CentralWarehouseProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CentralWarehouseDialogType>(null)
  const [currentRow, setCurrentRow] = useState<TotalWarehouse | null>(null)

  return (
    <CentralWarehouseContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CentralWarehouseContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCentralWarehouse = () => {
  const context = React.useContext(CentralWarehouseContext)

  if (!context) {
    throw new Error('useCentralWarehouse must be used within <CentralWarehouseProvider>')
  }

  return context
}
