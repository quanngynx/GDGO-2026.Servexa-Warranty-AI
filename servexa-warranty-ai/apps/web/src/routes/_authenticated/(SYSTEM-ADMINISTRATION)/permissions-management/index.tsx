import { PermissionsManagement } from '@/features/(SYSTEM-ADMINISTRATION)/premissions-management'
import { createFileRoute } from '@tanstack/react-router'
import { adminListSearchSchema } from '../search-schemas'

export const Route = createFileRoute(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/permissions-management/',
)({
  validateSearch: adminListSearchSchema,
  component: PermissionsManagement,
})
