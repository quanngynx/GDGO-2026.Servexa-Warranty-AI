import { createFileRoute } from '@tanstack/react-router'
import { WeeklyReport } from '@/features/(REPORTS)/weekly-report'

export const Route = createFileRoute(
  '/_authenticated/(REPORTS)/weekly-report/',
)({
  beforeLoad: () => ({ title: 'Weekly Report' }),
  component: WeeklyReport,
})
