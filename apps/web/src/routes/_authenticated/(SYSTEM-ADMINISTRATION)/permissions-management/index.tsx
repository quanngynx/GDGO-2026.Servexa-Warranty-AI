import { PermissionsManagement } from '@/features/(SYSTEM-ADMINISTRATION)/premissions-management'
import { createFileRoute } from '@tanstack/react-router'
import { adminListSearchSchema } from '../../../../libs/search-schemas'

export const Route = createFileRoute(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/permissions-management/',
)({
  beforeLoad: () => ({ title: 'Permissions Management' }),
  validateSearch: adminListSearchSchema,
  component: PermissionsManagement,
})
