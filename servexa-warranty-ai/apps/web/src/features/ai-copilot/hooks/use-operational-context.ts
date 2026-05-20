import { useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";

import { useOperationalContextPatch } from "@/features/ai-copilot/context/operational-context-provider";
import { toSelectedCaseSummary } from "@/features/ai-copilot/lib/to-selected-case-summary";
import { useAuthStore } from "@/stores/auth-store";
import type { SelectedCaseSummary } from "@servexa-warranty-ai/ai-contracts";

/** Table-row snapshot for copilot handoff summaries (no extra API call). */
export type RepairCaseSnapshot = {
  caseNumber: string;
  status: string;
  priority: string;
  customerName: string;
  customerPhone: string;
  productModel: string | null;
  modelCode: string | null;
  serialNumber: string;
  receivedDate: string;
  promisedDeliveryDate: string;
  warrantyForm: string;
  warrantyServiceType: string;
  totalCost: number;
  errorPhenomena: string | null;
};

/** Serialized into CopilotKit execution context via useAgentContext. */
export type OperationalPageContext = {
  currentRoute: string;
  repairCaseId: string | null;
  caseNumber: string | null;
  repairCaseSnapshot: RepairCaseSnapshot | null;
  technicianId: string | null;
  customerId: string | null;
  productModel: string | null;
  warrantyStatus: string | null;
  selectedInventoryItemId: string | null;
  selectedTechnicianId: string | null;
  currentUserRole: string | null;
  currentUserId: string | null;
  selectedCaseSummary: SelectedCaseSummary | null;
};

export function useOperationalPageContext(): OperationalPageContext {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useAuthStore((s) => s.user);
  const { context: patch } = useOperationalContextPatch();

  return useMemo(() => {
    const base = {
      currentRoute: pathname,
      repairCaseId: patch.repairCaseId ?? null,
      caseNumber: patch.caseNumber ?? null,
      repairCaseSnapshot: patch.repairCaseSnapshot ?? null,
      technicianId: patch.technicianId ?? null,
      customerId: patch.customerId ?? null,
      productModel: patch.productModel ?? null,
      warrantyStatus: patch.warrantyStatus ?? null,
      selectedInventoryItemId: patch.selectedInventoryItemId ?? null,
      selectedTechnicianId: patch.selectedTechnicianId ?? patch.technicianId ?? null,
      currentUserRole: user?.role ?? null,
      currentUserId: user?.id ?? null,
    };
    return {
      ...base,
      selectedCaseSummary: toSelectedCaseSummary(base),
    };
  }, [pathname, patch, user?.id, user?.role]);
}
