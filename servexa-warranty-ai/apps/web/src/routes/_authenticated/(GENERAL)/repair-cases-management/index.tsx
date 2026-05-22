import { RepairCasesManagement } from "@/features/(GENERAL)/repair-cases-management";
import { RepairCaseRouteSync } from "@/features/ai-copilot/components/repair-case-route-sync";
import { repairCasesListSearchSchema } from "@/libs/search-schemas";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/(GENERAL)/repair-cases-management/",
)({
  validateSearch: repairCasesListSearchSchema,
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
