import React, { useState } from 'react'
import useDialogState from '@servexa-warranty-ai/ui/hooks/use-dialog-state'
import { type Document } from '../data/schema'

type DocumentsDialogType = 'invite' | 'add' | 'edit' | 'delete'

type DocumentsContextType = {
  open: DocumentsDialogType | null
  setOpen: (str: DocumentsDialogType | null) => void
  currentRow: Document | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Document | null>>
}

const DocumentsContext = React.createContext<DocumentsContextType | null>(null)

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DocumentsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Document | null>(null)

  return (
    <DocumentsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </DocumentsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDocuments = () => {
  const context = React.useContext(DocumentsContext)

  if (!context) {
    throw new Error('useDocuments must be used within <DocumentsProvider>')
  }

  return context
}
