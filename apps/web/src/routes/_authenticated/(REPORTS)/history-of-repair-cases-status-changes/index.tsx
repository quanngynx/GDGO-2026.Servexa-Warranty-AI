import { createFileRoute } from '@tanstack/react-router'
import { HistoryOfRepairCasesStatusChanges } from '@/features/(REPORTS)/history-of-repair-cases-status-changes'

export const Route = createFileRoute(
  '/_authenticated/(REPORTS)/history-of-repair-cases-status-changes/',
)({
  beforeLoad: () => ({ title: 'History of repair cases status changes' }),
  component: HistoryOfRepairCasesStatusChanges,
})
