import { createFileRoute } from '@tanstack/react-router'
import { AccessoriesStatusStatistics } from '@/features/(REPORTS)/accessories-status-statistics'

export const Route = createFileRoute(
  '/_authenticated/(REPORTS)/accessories-status-statistics/',
)({
  beforeLoad: () => ({ title: 'Accessories Status Statistics' }),
  component: AccessoriesStatusStatistics,
})
