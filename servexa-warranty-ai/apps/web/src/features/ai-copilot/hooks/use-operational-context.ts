import { useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";

import { useAuthStore } from "@/stores/auth-store";

/** Serialized into CopilotKit execution context via useAgentContext. */
export type OperationalPageContext = {
  currentRoute: string;
  repairCaseId: string | null;
  technicianId: string | null;
  customerId: string | null;
  productModel: string | null;
  warrantyStatus: string | null;
  currentUserRole: string | null;
  currentUserId: string | null;
};

export function useOperationalPageContext(): OperationalPageContext {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useAuthStore((s) => s.user);

  return useMemo(
    () => ({
      currentRoute: pathname,
      repairCaseId: null,
      technicianId: null,
      customerId: null,
      productModel: null,
      warrantyStatus: null,
      currentUserRole: user?.role ?? null,
      currentUserId: user?.id ?? null,
    }),
    [pathname, user?.id, user?.role],
  );
}
