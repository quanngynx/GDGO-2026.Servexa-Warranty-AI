import { createFileRoute } from '@tanstack/react-router'
import { PscCostReport } from '@/features/(REPORTS)/psc-cost-report'

export const Route = createFileRoute(
  '/_authenticated/(REPORTS)/psc-cost-report/',
)({
  beforeLoad: () => ({ title: 'PSC Cost Report' }),
  component: PscCostReport,
})
