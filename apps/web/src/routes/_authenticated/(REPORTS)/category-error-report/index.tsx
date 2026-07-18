import { createFileRoute } from '@tanstack/react-router'
import { CategoryErrorReport } from '@/features/(REPORTS)/category-error-report'

export const Route = createFileRoute(
  '/_authenticated/(REPORTS)/category-error-report/',
)({
  beforeLoad: () => ({ title: 'Category Error Report' }),
  component: CategoryErrorReport,
})
