import React, { useState } from 'react'
import useDialogState from '@servexa-warranty-ai/ui/hooks/use-dialog-state'
import { type Model } from '../data/schema'
type ProductsDialogType = 'invite' | 'add' | 'edit' | 'delete' | 'import' | 'restore'

type ProductsContextType = {
  open: ProductsDialogType | null
  setOpen: (str: ProductsDialogType | null) => void
  currentRow: Model | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Model | null>>
}

const ProductsContext = React.createContext<ProductsContextType | null>(null)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ProductsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Model | null>(null)

  return (
    <ProductsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ProductsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => {
  const context = React.useContext(ProductsContext)

  if (!context) {
    throw new Error('useProducts must be used within <ProductsProvider>')
  }

  return context
}
