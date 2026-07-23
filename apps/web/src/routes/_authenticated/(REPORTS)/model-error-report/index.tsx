import { createFileRoute } from '@tanstack/react-router'
import { ModelErrorReport } from '@/features/(REPORTS)/model-error-report'

export const Route = createFileRoute(
  '/_authenticated/(REPORTS)/model-error-report/',
)({
  beforeLoad: () => ({ title: 'Model Error Report' }),
  component: ModelErrorReport,
})
