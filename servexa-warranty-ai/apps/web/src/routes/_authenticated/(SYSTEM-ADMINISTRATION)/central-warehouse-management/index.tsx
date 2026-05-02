import { CentralWarehouseManagement } from "@/features/(SYSTEM-ADMINISTRATION)/central-warehouse-management";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/central-warehouse-management/"
)({
  component: CentralWarehouseManagement,
});
