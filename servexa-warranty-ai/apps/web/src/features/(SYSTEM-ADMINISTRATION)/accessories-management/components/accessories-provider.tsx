import React, { useState } from 'react'
import useDialogState from '@servexa-warranty-ai/ui/hooks/use-dialog-state'
import { type Accessory } from '../data/schema'

type AccessoriesDialogType = 'invite' | 'add' | 'edit' | 'delete'

type AccessoriesContextType = {
  open: AccessoriesDialogType | null
  setOpen: (str: AccessoriesDialogType | null) => void
  currentRow: Accessory | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Accessory | null>>
}

const AccessoriesContext = React.createContext<AccessoriesContextType | null>(null)

export function AccessoriesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<AccessoriesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Accessory | null>(null)

  return (
    <AccessoriesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </AccessoriesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAccessories = () => {
  const context = React.useContext(AccessoriesContext)

  if (!context) {
    throw new Error('useAccessories must be used within <AccessoriesProvider>')
  }

  return context
}
