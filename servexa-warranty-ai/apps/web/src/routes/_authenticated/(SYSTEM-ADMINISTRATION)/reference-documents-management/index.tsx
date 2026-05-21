import { ReferenceDocumentsManagement } from '@/features/(SYSTEM-ADMINISTRATION)/reference-documents-management'
import { createFileRoute } from '@tanstack/react-router'
import { adminListSearchSchema } from '../search-schemas'

export const Route = createFileRoute(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/reference-documents-management/',
)({
  validateSearch: adminListSearchSchema,
  component: ReferenceDocumentsManagement,
})
