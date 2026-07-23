import { createFileRoute } from '@tanstack/react-router'
import { PaymentReport } from '@/features/(REPORTS)/payment-report'

export const Route = createFileRoute(
  '/_authenticated/(REPORTS)/payment-report/',
)({
  beforeLoad: () => ({ title: 'Payment Report' }),
  component: PaymentReport,
})
