import { ReferenceDocumentsManagement } from '@/features/(SYSTEM-ADMINISTRATION)/reference-documents-management'
import { createFileRoute } from '@tanstack/react-router'
import { adminListSearchSchema } from '../../../../libs/search-schemas'

export const Route = createFileRoute(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/reference-documents-management/',
)({
  beforeLoad: () => ({ title: 'Reference Documents Management' }),
  validateSearch: adminListSearchSchema,
  component: ReferenceDocumentsManagement,
})
