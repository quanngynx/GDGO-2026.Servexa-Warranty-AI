import { createFileRoute } from '@tanstack/react-router'
import { OutOfWarrantyReport } from '@/features/(REPORTS)/out-of-warranty-report'

export const Route = createFileRoute(
  '/_authenticated/(REPORTS)/out-of-warranty-report/',
)({
  beforeLoad: () => ({ title: 'Out of Warranty Report' }),
  component: OutOfWarrantyReport,
})
