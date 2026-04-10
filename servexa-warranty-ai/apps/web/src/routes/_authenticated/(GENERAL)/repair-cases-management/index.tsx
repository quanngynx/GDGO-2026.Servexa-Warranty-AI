import { RepairCasesManagement } from "@/features/(GENERAL)/repair-cases-management";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/(GENERAL)/repair-cases-management/"
)({
  component: RepairCasesManagement,
});
