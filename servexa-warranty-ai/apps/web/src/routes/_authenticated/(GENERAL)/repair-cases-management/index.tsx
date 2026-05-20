import { z } from "zod";

import { RepairCasesManagement } from "@/features/(GENERAL)/repair-cases-management";
import { RepairCaseRouteSync } from "@/features/ai-copilot/components/repair-case-route-sync";
import { createFileRoute } from "@tanstack/react-router";

const searchSchema = z.object({
  caseId: z.string().optional(),
});

export const Route = createFileRoute(
  "/_authenticated/(GENERAL)/repair-cases-management/",
)({
  validateSearch: searchSchema,
  component: RepairCasesManagementRoute,
});

function RepairCasesManagementRoute() {
  return (
    <>
      <RepairCaseRouteSync />
      <RepairCasesManagement />
    </>
  );
}
