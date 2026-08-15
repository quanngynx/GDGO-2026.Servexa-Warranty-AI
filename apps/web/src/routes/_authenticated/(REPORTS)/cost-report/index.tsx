import { createFileRoute } from '@tanstack/react-router'
import { CostReport } from '@/features/(REPORTS)/cost-report'

export const Route = createFileRoute(
  '/_authenticated/(REPORTS)/cost-report/',
)({
  beforeLoad: () => ({ title: 'Cost Report' }),
  component: CostReport,
})
