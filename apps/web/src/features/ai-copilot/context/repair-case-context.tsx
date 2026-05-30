import { useOperationalContextPatch } from "./operational-context-provider";

/** Repair-case slice of operational context (checklist alias). */
export function useRepairCaseContext() {
  const { context, setOperationalContext } = useOperationalContextPatch();
  return {
    repairCaseId: context.repairCaseId ?? null,
    caseNumber: context.caseNumber ?? null,
    customerId: context.customerId ?? null,
    productModel: context.productModel ?? null,
    warrantyStatus: context.warrantyStatus ?? null,
    setRepairCaseContext: setOperationalContext,
  };
}
