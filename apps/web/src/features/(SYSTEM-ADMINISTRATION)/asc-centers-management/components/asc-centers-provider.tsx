import React, { useState } from 'react'
import useDialogState from '@servexa-warranty-ai/ui/hooks/use-dialog-state'
import { type AscCenter } from '../data/schema'

type AscCentersDialogType = 'invite' | 'add' | 'edit' | 'delete'

type AscCentersContextType = {
  open: AscCentersDialogType | null
  setOpen: (str: AscCentersDialogType | null) => void
  currentRow: AscCenter | null
  setCurrentRow: React.Dispatch<React.SetStateAction<AscCenter | null>>
}

const AscCentersContext = React.createContext<AscCentersContextType | null>(null)

export function AscCentersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<AscCentersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<AscCenter | null>(null)

  return (
    <AscCentersContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </AscCentersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAscCenters = () => {
  const context = React.useContext(AscCentersContext)

  if (!context) {
    throw new Error('useAscCenters must be used within <AscCentersProvider>')
  }

  return context
}
