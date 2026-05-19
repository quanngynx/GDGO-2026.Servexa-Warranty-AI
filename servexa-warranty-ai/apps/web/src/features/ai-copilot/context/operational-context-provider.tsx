import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { OperationalPageContext } from "../hooks/use-operational-context";

type OperationalContextValue = {
  context: Partial<OperationalPageContext>;
  setOperationalContext: (patch: Partial<OperationalPageContext>) => void;
  clearOperationalContext: () => void;
};

const OperationalContext = createContext<OperationalContextValue | null>(null);

export function OperationalContextProvider({ children }: { children: ReactNode }) {
  const [patch, setPatch] = useState<Partial<OperationalPageContext>>({});

  const setOperationalContext = useCallback((next: Partial<OperationalPageContext>) => {
    setPatch((prev) => ({ ...prev, ...next }));
  }, []);

  const clearOperationalContext = useCallback(() => {
    setPatch({});
  }, []);

  const value = useMemo(
    () => ({
      context: patch,
      setOperationalContext,
      clearOperationalContext,
    }),
    [patch, setOperationalContext, clearOperationalContext],
  );

  return (
    <OperationalContext.Provider value={value}>{children}</OperationalContext.Provider>
  );
}

export function useOperationalContextPatch() {
  const ctx = useContext(OperationalContext);
  if (!ctx) {
    return {
      context: {} as Partial<OperationalPageContext>,
      setOperationalContext: () => {},
      clearOperationalContext: () => {},
    };
  }
  return ctx;
}
