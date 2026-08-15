import { createFileRoute } from '@tanstack/react-router'
import { PurchaseLocationErrorReport } from '@/features/(REPORTS)/purchase-location-error-report'

export const Route = createFileRoute(
  '/_authenticated/(REPORTS)/purchase-location-error-report/',
)({
  beforeLoad: () => ({ title: 'Purchase Location Error Report' }),
  component: PurchaseLocationErrorReport,
})
