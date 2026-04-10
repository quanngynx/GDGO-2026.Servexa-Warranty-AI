import { createFileRoute } from "@tanstack/react-router";
import { PaymentPendingRepairCases } from "@/features/(GENERAL)/payment-pending-repair-cases";

export const Route = createFileRoute(
  "/_authenticated/(GENERAL)/payment-pending-repair-cases/"
)({
  component: PaymentPendingRepairCases,
});
