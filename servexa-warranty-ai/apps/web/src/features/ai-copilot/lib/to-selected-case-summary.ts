import type { SelectedCaseSummary } from "@servexa-warranty-ai/ai-contracts";

import type {
  OperationalPageContext,
  RepairCaseSnapshot,
} from "../hooks/use-operational-context";

export function toSelectedCaseSummary(
  operational: Pick<
    OperationalPageContext,
    "repairCaseId" | "caseNumber" | "repairCaseSnapshot"
  >,
): SelectedCaseSummary | null {
  const repairCaseId = operational.repairCaseId;
  if (!repairCaseId) return null;

  const snap = operational.repairCaseSnapshot;
  return {
    repairCaseId,
    caseNumber: snap?.caseNumber ?? operational.caseNumber ?? undefined,
    status: snap?.status,
    priority: snap?.priority,
    customerName: snap?.customerName,
    customerPhone: snap?.customerPhone,
    productModel: snap?.productModel ?? null,
    modelCode: snap?.modelCode ?? null,
    serialNumber: snap?.serialNumber,
    warrantyForm: snap?.warrantyForm ?? null,
    warrantyServiceType: snap?.warrantyServiceType ?? null,
    errorPhenomena: snap?.errorPhenomena ?? null,
    promisedDeliveryDate: snap?.promisedDeliveryDate ?? null,
  };
}

export function toSelectedCaseSummaryFromSnapshot(
  repairCaseId: string,
  snap: RepairCaseSnapshot,
): SelectedCaseSummary {
  return {
    repairCaseId,
    caseNumber: snap.caseNumber,
    status: snap.status,
    priority: snap.priority,
    customerName: snap.customerName,
    customerPhone: snap.customerPhone,
    productModel: snap.productModel,
    modelCode: snap.modelCode,
    serialNumber: snap.serialNumber,
    warrantyForm: snap.warrantyForm,
    warrantyServiceType: snap.warrantyServiceType,
    errorPhenomena: snap.errorPhenomena,
    promisedDeliveryDate: snap.promisedDeliveryDate,
  };
}
