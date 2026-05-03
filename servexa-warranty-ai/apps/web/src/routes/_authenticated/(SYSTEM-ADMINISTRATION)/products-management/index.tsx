import { ProductsManagement } from "@/features/(SYSTEM-ADMINISTRATION)/products-management";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/products-management/"
)({
  component: ProductsManagement,
});
