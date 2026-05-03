import { AccessoriesManagement } from "@/features/(SYSTEM-ADMINISTRATION)/accessories-management";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/accessories-management/"
)({
  component: AccessoriesManagement,
});
