import { CustomerManagement } from "@/features/(SYSTEM-ADMINISTRATION)/customer-management";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/customer-management/"
)({
  component: CustomerManagement,
});
