import { PurchaseLocationsManagement } from "@/features/(SYSTEM-ADMINISTRATION)/purchase-locations-management";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/purchase-locations-management/"
)({
  component: PurchaseLocationsManagement,
});
