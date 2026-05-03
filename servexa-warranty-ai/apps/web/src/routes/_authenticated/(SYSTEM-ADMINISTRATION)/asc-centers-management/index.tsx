import { AscCentersManagement } from "@/features/(SYSTEM-ADMINISTRATION)/asc-centers-management";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/asc-centers-management/"
)({
  component: AscCentersManagement,
});
