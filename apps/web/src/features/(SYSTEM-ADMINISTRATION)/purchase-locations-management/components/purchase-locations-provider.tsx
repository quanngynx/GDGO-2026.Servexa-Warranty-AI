import React, { useState } from 'react'
import useDialogState from '@servexa-warranty-ai/ui/hooks/use-dialog-state'
import { type PurchaseLocation } from '../data/schema'

type PurchaseLocationsDialogType = 'invite' | 'add' | 'edit' | 'delete'

type PurchaseLocationsContextType = {
  open: PurchaseLocationsDialogType | null
  setOpen: (str: PurchaseLocationsDialogType | null) => void
  currentRow: PurchaseLocation | null
  setCurrentRow: React.Dispatch<React.SetStateAction<PurchaseLocation | null>>
}

const PurchaseLocationsContext = React.createContext<PurchaseLocationsContextType | null>(null)

export function PurchaseLocationsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<PurchaseLocationsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<PurchaseLocation | null>(null)

  return (
    <PurchaseLocationsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </PurchaseLocationsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePurchaseLocations = () => {
  const context = React.useContext(PurchaseLocationsContext)

  if (!context) {
    throw new Error('usePurchaseLocations must be used within <PurchaseLocationsProvider>')
  }

  return context
}
