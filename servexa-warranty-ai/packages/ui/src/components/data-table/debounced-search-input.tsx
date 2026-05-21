import { useEffect, useState } from 'react'
import { Input } from '../input'
import { useDebouncedCallback } from '../../hooks/use-debounced-callback'

type DebouncedSearchInputProps = {
  value: string
  onDebouncedChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
  className?: string
}

export function DebouncedSearchInput({
  value,
  onDebouncedChange,
  placeholder = 'Filter...',
  debounceMs = 500,
  className,
}: DebouncedSearchInputProps) {
  const [inputValue, setInputValue] = useState(value)
  const debouncedChange = useDebouncedCallback(onDebouncedChange, debounceMs)

  useEffect(() => {
    setInputValue(value)
    debouncedChange.cancel()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cancel is stable on debounced fn
  }, [value])

  return (
    <Input
      placeholder={placeholder}
      value={inputValue}
      onChange={(event) => {
        const next = event.target.value
        setInputValue(next)
        debouncedChange(next)
      }}
      className={className}
    />
  )
}
