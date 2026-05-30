import React, { useState } from 'react'
import useDialogState from '@servexa-warranty-ai/ui/hooks/use-dialog-state'
import { type Permission } from '../data/schema'

type PermissionsDialogType = 'invite' | 'add' | 'edit' | 'delete'

type PermissionsContextType = {
  open: PermissionsDialogType | null
  setOpen: (str: PermissionsDialogType | null) => void
  currentRow: Permission | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Permission | null>>
}

const PermissionsContext = React.createContext<PermissionsContextType | null>(null)

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<PermissionsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Permission | null>(null)

  return (
    <PermissionsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </PermissionsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePermissions = () => {
  const context = React.useContext(PermissionsContext)

  if (!context) {
    throw new Error('usePermissions must be used within <PermissionsProvider>')
  }

  return context
}
