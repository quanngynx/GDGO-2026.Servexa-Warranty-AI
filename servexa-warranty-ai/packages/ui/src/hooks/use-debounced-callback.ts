import { useCallback, useEffect, useRef } from 'react'

export type DebouncedCallback<T extends (...args: never[]) => void> = T & {
  cancel: () => void
}

export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  delayMs: number,
): DebouncedCallback<T> {
  const callbackRef = useRef(callback)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => cancel, [cancel])

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      cancel()
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        callbackRef.current(...args)
      }, delayMs)
    },
    [cancel, delayMs],
  ) as DebouncedCallback<T>

  debounced.cancel = cancel

  return debounced
}
