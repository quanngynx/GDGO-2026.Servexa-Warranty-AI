import { RolesManagement } from "@/features/(SYSTEM-ADMINISTRATION)/roles-management";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/roles-management/"
)({
  component: RolesManagement,
});
