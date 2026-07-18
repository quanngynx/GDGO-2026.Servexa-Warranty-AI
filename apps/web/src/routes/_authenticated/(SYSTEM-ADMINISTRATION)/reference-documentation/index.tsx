import { ReferenceDocumentsManagementView } from '@/features/(SYSTEM-ADMINISTRATION)/reference-documents-management'
import { type NavigateFn } from '@servexa-warranty-ai/ui/hooks/use-table-url-state'
import { createFileRoute } from '@tanstack/react-router'
import { adminListSearchSchema } from '../../../../libs/search-schemas'

export const Route = createFileRoute(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/reference-documentation/',
)({
  beforeLoad: () => ({ title: 'Reference Documentation' }),
  validateSearch: adminListSearchSchema,
  component: ReferenceDocumentationPage,
})

function ReferenceDocumentationPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  return (
    <ReferenceDocumentsManagementView
      search={search}
      navigate={navigate as NavigateFn}
    />
  )
}
