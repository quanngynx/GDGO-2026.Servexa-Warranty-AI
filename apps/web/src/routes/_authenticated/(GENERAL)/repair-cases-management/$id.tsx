import { createFileRoute } from '@tanstack/react-router'
import { RepairCaseDetail } from '@/features/(GENERAL)/repair-cases-management/components/repair-case-detail'

export const Route = createFileRoute(
  '/_authenticated/(GENERAL)/repair-cases-management/$id',
)({
  beforeLoad: () => ({
    title: 'Case Detail',
  }),
  component: RepairCaseDetailPage,
})

function RepairCaseDetailPage() {
  const { id } = Route.useParams()
  return (
    <div className="pb-4">
      <RepairCaseDetail id={id} />
    </div>
  )
}
