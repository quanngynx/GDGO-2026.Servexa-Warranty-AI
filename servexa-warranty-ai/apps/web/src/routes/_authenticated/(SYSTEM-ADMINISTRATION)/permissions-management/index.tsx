import { PermissionsManagement } from "@/features/(SYSTEM-ADMINISTRATION)/premissions-management";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/permissions-management/"
)({
  component: PermissionsManagement,
});
